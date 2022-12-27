import { FunctionComponent } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { HexCoordinates, Tile as TileType } from '../domain';
import { TileEvent } from '../services';
import { Dispatcher, useHiveDispatchListener } from '../utilities/dispatcher';
import { handleDragOver, handleKeyboardNav, isEnterOrSpace } from '../utilities/handlers';
import { useClassReducer } from '../utilities/class-reducer';
import Hexagon from './Hexagon';

const isValidMove = (validMoves: Array<HexCoordinates>, coords: HexCoordinates) =>
  validMoves.some((destination) => destination.q == coords.q && destination.r == coords.r);

type Properties = { coords: HexCoordinates; historical?: boolean; hidden?: boolean };
const GameCell: FunctionComponent<Properties> = (properties) => {
  const { coords, children, historical = false, hidden } = properties;
  const [classes, setClasses] = useClassReducer('hide');
  setClasses({ type: historical ? 'add' : 'remove', classes: ['historical'] });
  const [selectedTile, setSelectedTile] = useState<TileType | null>(null);
  const dispatcher = useContext(Dispatcher);
  useEffect(() => setClasses({ type: hidden ? 'add' : 'remove', classes: ['hide'] }), [hidden, setClasses]);

  useHiveDispatchListener<TileEvent>('tileDeselected', () => {
    if (selectedTile !== null) setSelectedTile(null);
    setClasses({ type: 'remove', classes: ['active', 'can-drop', 'no-drop'] });
  });

  useHiveDispatchListener<TileEvent>('tileSelected', (intent) => {
    if (isValidMove(intent.tile.moves, coords)) {
      setSelectedTile(intent.tile);
      setClasses({ type: 'add', classes: ['can-drop'] });
    } else {
      setClasses({ type: 'add', classes: ['no-drop'] });
    }
  });

  useHiveDispatchListener<TileEvent>('tileDropped', () => {
    if (classes.includes('active') && selectedTile && isValidMove(selectedTile.moves, coords)) {
      dispatcher.dispatch({
        type: 'move',
        move: { coords, tileId: selectedTile.id },
      });
    }
  });

  const handleDragLeave = (event: DragEvent) => {
    event.stopPropagation();
    setClasses({ type: 'remove', classes: ['active'] });
  };

  const handleDragEnter = () => {
    setClasses({ type: 'add', classes: ['active'] });
  };

  const handleClick = (event: UIEvent) => {
    if (!(selectedTile && isValidMove(selectedTile.moves, coords))) return;
    event.stopPropagation();
    dispatcher.dispatch({ type: 'tileClear', tile: selectedTile });
    dispatcher.dispatch({ type: 'move', move: { coords, tileId: selectedTile.id } });
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (handleKeyboardNav(event) || !isEnterOrSpace(event)) return;
    handleClick(event);
  };

  const attributes = {
    class: classes || undefined,
    tabindex: selectedTile && isValidMove(selectedTile.moves, coords) ? 0 : undefined,
    role: hidden ? 'none' : 'cell',
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
    <Hexagon hidden={hidden} {...attributes} {...handlers}>
      {children}
    </Hexagon>
  );
};
GameCell.displayName = 'Cell';
export default GameCell;
