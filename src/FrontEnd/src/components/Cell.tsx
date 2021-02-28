import { FunctionComponent, RenderableProps, h } from 'preact';
import { HexCoordinates, Tile as TileType } from '../domain';
import { HiveEvent } from '../hive-event-emitter';
import { handleDragOver, handleKeyboardNav, isEnterOrSpace } from '../handlers';
import { useClassReducer, useHiveEventEmitter } from '../hooks';
import { useEffect, useState } from 'preact/hooks';

export default (
  props: RenderableProps<{ coords: HexCoordinates; hidden?: boolean }>
): ReturnType<FunctionComponent> => {
  const { coords, hidden, children } = props;
  const isValidMove = (validMoves: HexCoordinates[]) =>
    validMoves.some((dest) => dest.q == coords.q && dest.r == coords.r);
  const [classes, setClasses] = useClassReducer(['hex', 'cell']);
  const [selectedTile, setSelectedTile] = useState<TileType | null>(null);
  useEffect(() =>  setClasses({ type: hidden ? 'add' : 'remove', classes: ['entry'] }), [hidden]);

  const handleHiveEvent = (e: HiveEvent) => {
    if (e.type === 'tileDeselected' && isValidMove(e.tile.moves)) {
      setSelectedTile(null);
      setClasses({ type: 'remove', classes: ['can-drop', 'active'] });
    } else if (e.type === 'tileSelected' && isValidMove(e.tile.moves)) {
      setSelectedTile(e.tile);
      setClasses({ type: 'add', classes: ['can-drop'] });
    } else if (e.type === 'tileDropped') {
      if (classes.includes('active'))
        if (selectedTile && isValidMove(selectedTile.moves))
          hiveEventEmitter.emit({
            type: 'move',
            move: { coords, tileId: selectedTile.id },
          });
    }
  };
  const hiveEventEmitter = useHiveEventEmitter(handleHiveEvent);

  const handleDragLeave = (ev: { stopPropagation: () => void }) => {
    ev.stopPropagation();
    setClasses({ type: 'remove', classes: ['active'] });
  };

  const handleDragEnter = () => {
    if (selectedTile) setClasses({ type: 'add', classes: ['active'] });
  };

  const handleClick = (ev: { stopPropagation: () => void }) => {
    if (selectedTile && isValidMove(selectedTile.moves)) {
      ev.stopPropagation();
      hiveEventEmitter.emit({ type: 'move', move: { coords, tileId: selectedTile.id } });
      hiveEventEmitter.emit({ type: 'tileClear', tile: selectedTile });
    }
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (!handleKeyboardNav(e) && isEnterOrSpace(e)) return handleClick(e);
  };

  const attributes = {
    className: classes.join(' '),
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
