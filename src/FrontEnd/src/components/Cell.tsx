import { Cell, HexCoordinates, Tile as TileType } from '../domain';
import { FunctionComponent, h } from 'preact';
import { HiveEvent } from '../hive-event-emitter';
import { deepEqual } from 'fast-equals';
import { handleDragOver, handleKeyboardNav, isEnterOrSpace } from '../handlers';
import { memo } from 'preact/compat';
import { useClassReducer, useHiveEventEmitter } from '../hooks';
import { useEffect, useState } from 'preact/hooks';
import Tile from './Tile';

type Props = Cell;

const CellFC: FunctionComponent<Props> = (props: Props) => {
  const { tiles, coords } = props;
  const isValidMove = (validMoves: HexCoordinates[]) =>
    validMoves.some((dest) => dest.q == coords.q && dest.r == coords.r);
  const [classes, setClasses] = useClassReducer(['hex', 'cell', 'entry']);
  const [selectedTile, setSelectedTile] = useState<TileType | null>(null);
  useEffect(() => setClasses({ type: 'remove', classes: ['entry'] }), []);

  const handleHiveEvent = (e: HiveEvent) => {
    if (e.type === 'tileSelect') {
      const canDrop = isValidMove(e.tile.moves);
      setSelectedTile(e.tile);
      setClasses({ type: canDrop ? 'add' : 'remove', classes: ['can-drop'] });
    }

    if (e.type === 'tileDropped') {
      if (classes.includes('active'))
        if (selectedTile && isValidMove(selectedTile.moves))
          hiveEventEmitter.emit({
            type: 'move',
            move: { coords, tileId: selectedTile.id },
          });
      hiveEventEmitter.emit({ type: 'tileClear', tile: e.tile });
    }

    if (e.type === 'tileDeselect' || e.type === 'tileClear') {
      setSelectedTile(null);
      setClasses({ type: 'remove', classes: ['can-drop', 'active'] });
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
      {tiles.length > 0 && <Tile key={tiles[0].id} {...tiles[0]} />}
    </div>
  );
};

CellFC.displayName = 'Cell';
export default memo(CellFC, (p, n) => deepEqual(p.coords, n.coords) && !p.tiles.length && !n.tiles.length);
