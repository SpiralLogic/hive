import { FunctionComponent, h } from 'preact';
import { HexCoordinates, Tile as TileType } from '../domain';
import { TileEvent } from '../utilities/hive-dispatcher';
import { addHiveEventListener, useClassReducer, useHiveDispatcher } from '../utilities/hooks';
import { handleDragOver, handleKeyboardNav, isEnterOrSpace } from '../utilities/handlers';
import { useEffect, useState } from 'preact/hooks';
import Cell from './Cell';

type CellProps = { coords: HexCoordinates; hidden?: boolean };
const ActiveCell: FunctionComponent<CellProps> = (props) => {
  const { coords, children, hidden } = props;
  const [classes, setClasses] = useClassReducer('hide');
  const isValidMove = (validMoves: HexCoordinates[]) =>
    validMoves.some((dest) => dest.q == coords.q && dest.r == coords.r);
  const [selectedTile, setSelectedTile] = useState<TileType | null>(null);
  const hiveDispatcher = useHiveDispatcher();
  useEffect(() => setClasses({ type: hidden ? 'add' : 'remove', class: 'hide' }), [hidden]);

  addHiveEventListener<TileEvent>('tileDeselected', (event) => {
    if (!isValidMove(event.tile.moves)) {
      setClasses({ type: 'remove', class: 'no-drop' });
    }
    setSelectedTile(null);
    setClasses({ type: 'remove', class: 'can-drop' });
    setClasses({ type: 'remove', class: 'active' });
  });

  addHiveEventListener<TileEvent>('tileSelected', (event) => {
    if (!isValidMove(event.tile.moves)) {
      setClasses({ type: 'add', class: 'no-drop' });
    } else {
      setSelectedTile(event.tile);
      setClasses({ type: 'add', class: 'can-drop' });
    }
  });

  addHiveEventListener<TileEvent>('tileDropped', () => {
    if (classes.includes('active') && selectedTile && isValidMove(selectedTile.moves)) {
      hiveDispatcher.dispatch({
        type: 'move',
        move: { coords, tileId: selectedTile.id },
      });
    }
  });

  const handleDragLeave = (event: DragEvent) => {
    event.stopPropagation();
    setClasses({ type: 'remove', class: 'active' });
  };

  const handleDragEnter = () => {
    setClasses({ type: 'add', class: 'active' });
  };

  const handleClick = (event: UIEvent) => {
    if (!(selectedTile && isValidMove(selectedTile.moves))) return;
    event.stopPropagation();
    hiveDispatcher.dispatch({ type: 'move', move: { coords, tileId: selectedTile.id } });
    hiveDispatcher.dispatch({ type: 'tileClear', tile: selectedTile });
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (!handleKeyboardNav(e) && isEnterOrSpace(e)) return handleClick(e);
  };

  const attributes = {
    class: classes || undefined,
    tabindex: selectedTile && isValidMove(selectedTile.moves) ? 0 : undefined,
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
    <Cell hidden={hidden} {...attributes} {...handlers}>
      {children}
    </Cell>
  );
};
ActiveCell.displayName = 'Cell';
export default ActiveCell;
