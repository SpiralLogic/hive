import { FunctionComponent, RenderableProps, h } from 'preact';
import { HexCoordinates, Tile as TileType } from '../domain';
import { TileEvent } from '../utilities/hive-dispatcher';
import { addHiveEventListener, useClassReducer, useHiveDispatcher } from '../utilities/hooks';
import { handleDragOver, handleKeyboardNav, isEnterOrSpace } from '../utilities/handlers';
import { useEffect, useState } from 'preact/hooks';

export default (
  props: RenderableProps<{ coords: HexCoordinates; hidden?: boolean }>
): ReturnType<FunctionComponent> => {
  const { coords, hidden, children } = props;
  const isValidMove = (validMoves: HexCoordinates[]) =>
    validMoves.some((dest) => dest.q == coords.q && dest.r == coords.r);
  const [classes, setClasses] = useClassReducer('hex cell entry');
  const [selectedTile, setSelectedTile] = useState<TileType | null>(null);
  useEffect(() => setClasses({ type: hidden ? 'add' : 'remove', class: 'entry' }), [hidden]);
  const hiveDispatcher = useHiveDispatcher();

  addHiveEventListener<TileEvent>('tileDeselected', (event) => {
    if (!isValidMove(event.tile.moves)) return;
    setSelectedTile(null);
    setClasses({ type: 'remove', class: 'can-drop' });
    setClasses({ type: 'remove', class: 'active' });
  });

  addHiveEventListener<TileEvent>('tileSelected', (event) => {
    if (!isValidMove(event.tile.moves)) return;
    setSelectedTile(event.tile);
    setClasses({ type: 'add', class: 'can-drop' });
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
    if (selectedTile) setClasses({ type: 'add', class: 'active' });
  };

  const handleClick = (ev: UIEvent) => {
    if (!(selectedTile && isValidMove(selectedTile.moves))) return;
    ev.stopPropagation();
    hiveDispatcher.dispatch({ type: 'move', move: { coords, tileId: selectedTile.id } });
    hiveDispatcher.dispatch({ type: 'tileClear', tile: selectedTile });
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (!handleKeyboardNav(e) && isEnterOrSpace(e)) return handleClick(e);
  };

  const attributes = {
    class: classes,
    ondragover: handleDragOver,
    ondragleave: handleDragLeave,
    ondragenter: handleDragEnter,
    onmouseenter: handleDragEnter,
    onmouseleave: handleDragLeave,
    onclick: handleClick,
    onkeydown: handleKeydown,
    tabindex: selectedTile && isValidMove(selectedTile.moves) ? 0 : undefined,
  };

  return (
    <div {...attributes}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <use href="#hex" />
      </svg>
      {children}
    </div>
  );
};
