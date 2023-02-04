import { FunctionComponent } from 'preact';
import { useContext, useEffect, useRef } from 'preact/hooks';
import { HexCoordinates, Tile as TileType } from '../domain';
import { MoveEvent, TileEvent } from '../services';
import { handleDragOver, handleKeyboardNav, isEnterOrSpace } from '../utilities/handlers';
import Hexagon from './Hexagon';
import { useClassSignal } from '../hooks/useClassReducer';
import { Dispatcher, useHiveDispatchListener } from '../hooks/useHiveDispatchListener';
import {  useSignal } from '@preact/signals';

const isValidMove = (validMoves: Array<HexCoordinates>, coords: HexCoordinates) =>
  validMoves.some((destination) => destination.q == coords.q && destination.r == coords.r);

type Properties = { coords: HexCoordinates; historical?: boolean; hidden?: boolean };
const GameCell: FunctionComponent<Properties> = (properties) => {
  const { coords, children, historical = false, hidden } = properties;
  const [classes, classActions] = useClassSignal('hide');
  const canTabTo = useSignal(false);
  historical ? classActions.add('historical') : classActions.remove('historical');

  const selectedTile = useRef<TileType | null>(null);
  const dispatcher = useContext(Dispatcher);
  useEffect(() => (hidden ? classActions.add('hide') : classActions.remove('hide')), [hidden, classActions]);

  useHiveDispatchListener<TileEvent>('tileDeselected', () => {
    if (selectedTile.current !== null) selectedTile.current = null;
    classActions.remove('active', 'can-drop', 'no-drop');
    canTabTo.value = false;
  });

  useHiveDispatchListener<TileEvent>('tileSelected', (intent) => {
    selectedTile.current = intent.tile;
    if (isValidMove(intent.tile.moves, coords)) {
      classActions.add('can-drop');
      canTabTo.value = true;
    } else {
      classActions.add('no-drop');
      canTabTo.value = false;
    }
  });

  useHiveDispatchListener<TileEvent>('tileDropped', () => {
    if (
      classes.value.includes('active') &&
      selectedTile.current &&
      isValidMove(selectedTile.current.moves, coords)
    ) {
      dispatcher.dispatch({
        type: 'move',
        move: { coords, tileId: selectedTile.current.id },
      });
    }
  });

  const handleDragLeave = (event: DragEvent) => {
    event.stopPropagation();
    classActions.remove('active');
  };

  const handleDragEnter = () => {
    if (selectedTile.current) classActions.add('active');
  };

  const handleClick = (event: UIEvent) => {
    if (!(selectedTile.current && isValidMove(selectedTile.current.moves, coords))) return;
    event.stopPropagation();
    const move: MoveEvent = { type: 'move', move: { coords, tileId: selectedTile.current?.id } };
    dispatcher.dispatch({ type: 'tileClear', tile: selectedTile.current });
    dispatcher.dispatch(move);
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (handleKeyboardNav(event) || !isEnterOrSpace(event)) return;
    handleClick(event);
  };

  const attributes = {
    classes,
    role: 'cell',
  };

  const handlers = {
    ondragover: handleDragOver,
    ondragleave: handleDragLeave,
    ondragenter: handleDragEnter,
    onmouseenter: handleDragEnter,
    onmouseleave: handleDragLeave,
    onclick: handleClick,
    onkeydown: handleKeydown,
  };
  return (
    <Hexagon canTabTo={canTabTo} hidden={hidden} {...attributes} {...handlers}>
      {children}
    </Hexagon>
  );
};
GameCell.displayName = 'GameCell';
export default GameCell;
