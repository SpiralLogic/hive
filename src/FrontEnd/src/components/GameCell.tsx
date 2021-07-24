import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { HexCoordinates, Tile as TileType } from '../domain';
import { TileEvent } from '../services';
import { addHiveDispatchListener, dispatchHiveEvent } from '../utilities/dispatcher';
import { handleDragOver, handleKeyboardNav, isEnterOrSpace } from '../utilities/handlers';
import { useClassReducer } from '../utilities/class-reducer';
import Hexagon from './Hexagon';
const isValidMove = (validMoves: HexCoordinates[], coords: HexCoordinates) =>
  validMoves.some((dest) => dest.q == coords.q && dest.r == coords.r);

type Props = { coords: HexCoordinates; hidden?: boolean };
const GameCell: FunctionComponent<Props> = (props) => {
  const { coords, children, hidden } = props;
  const [classes, setClasses] = useClassReducer('hide');
  const [selectedTile, setSelectedTile] = useState<TileType | null>(null);

  useEffect(() => setClasses({ type: hidden ? 'add' : 'remove', classes: ['hide'] }), [hidden]);

  addHiveDispatchListener<TileEvent>('tileDeselected', () => {
    setSelectedTile(null);
    setClasses({ type: 'remove', classes: ['active', 'can-drop', 'no-drop'] });
  });

  addHiveDispatchListener<TileEvent>('tileSelected', (intent) => {
    if (!isValidMove(intent.tile.moves, coords)) {
      setClasses({ type: 'add', classes: ['no-drop'] });
    } else {
      setSelectedTile(intent.tile);
      setClasses({ type: 'add', classes: ['can-drop'] });
    }
  });

  addHiveDispatchListener<TileEvent>('tileDropped', () => {
    if (classes.includes('active') && selectedTile && isValidMove(selectedTile.moves, coords)) {
      dispatchHiveEvent({
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
    dispatchHiveEvent({ type: 'tileClear', tile: selectedTile });
    dispatchHiveEvent({ type: 'move', move: { coords, tileId: selectedTile.id } });
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (handleKeyboardNav(e) || !isEnterOrSpace(e)) return;
    handleClick(e);
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
