import { FunctionComponent, h } from 'preact';
import { HexCoordinates, Tile as TileType } from '../domain';
import { MoveEvent, TileEvent } from '../utilities/hive-dispatcher';
import { addHiveDispatchListener, dispatchHiveEvent, useClassReducer } from '../utilities/hooks';
import { handleDragOver, handleKeyboardNav, isEnterOrSpace } from '../utilities/handlers';
import { useEffect, useState } from 'preact/hooks';
import Hexagon from './Hexagon';

type Props = { coords: HexCoordinates; hidden?: boolean };
const GameCell: FunctionComponent<Props> = (props) => {
  const { coords, children, hidden } = props;
  const [classes, setClasses] = useClassReducer('hide');
  const [selectedTile, setSelectedTile] = useState<TileType | null>(null);

  const isValidMove = (validMoves: HexCoordinates[]) =>
    validMoves.some((dest) => dest.q == coords.q && dest.r == coords.r);
  useEffect(() => setClasses({ type: hidden ? 'add' : 'remove', classes: ['hide'] }), [hidden]);

  addHiveDispatchListener<TileEvent>('tileDeselected', (event) => {
    if (!isValidMove(event.tile.moves)) {
      setClasses({ type: 'remove', classes: ['no-drop'] });
    }
    setSelectedTile(null);
    setClasses({ type: 'remove', classes: ['active', 'can-drop'] });
  });

  addHiveDispatchListener<TileEvent>('tileSelected', (event) => {
    if (!isValidMove(event.tile.moves)) {
      setClasses({ type: 'add', classes: ['no-drop'] });
    } else {
      setSelectedTile(event.tile);
      setClasses({ type: 'add', classes: ['can-drop'] });
    }
  });

  addHiveDispatchListener<TileEvent>('tileDropped', () => {
    if (classes.includes('active') && selectedTile && isValidMove(selectedTile.moves)) {
      dispatchHiveEvent<MoveEvent>({
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
    if (!(selectedTile && isValidMove(selectedTile.moves))) return;
    event.stopPropagation();
    dispatchHiveEvent({ type: 'move', move: { coords, tileId: selectedTile.id } });
    dispatchHiveEvent({ type: 'tileClear', tile: selectedTile });
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (!handleKeyboardNav(e) && isEnterOrSpace(e)) return handleClick(e);
  };

  const attributes = {
    class: classes || undefined,
    tabindex: selectedTile && isValidMove(selectedTile.moves) ? 0 : undefined,
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
