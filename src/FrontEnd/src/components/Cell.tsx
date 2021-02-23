import { Cell, HexCoordinates, Tile as TileType } from '../domain';
import { FunctionComponent, h } from 'preact';
import { HiveEvent } from '../hive-event-emitter';
import { deepEqual } from 'fast-equals';
import { handleDragOver, handleKeyboardNav, isEnterOrSpace } from '../handlers';
import { memo } from 'preact/compat';
import { useClassReducer, useHiveEventEmitter } from '../hooks';
import { useState } from 'preact/hooks';
import Tile from './Tile';

type Props = Cell;

const CellFC: FunctionComponent<Props> = (props: Props) => {
  const { tiles, coords } = props;
  const isValidMove = (validMoves: HexCoordinates[]) =>
    validMoves.some((dest) => dest.q == coords.q && dest.r == coords.r);
  const [classes, setClasses] = useClassReducer(['hex', 'cell']);
  const [selectedTile, setSelectedTile] = useState<TileType | null>(null);

  function handleHiveEvent(e: HiveEvent) {
    if (e.type === 'tileSelected') {
      const canDrop = isValidMove(e.tile.moves);
      setSelectedTile(e.tile);
      setClasses({ type: canDrop ? 'add' : 'remove', classes: ['can-drop'] });
    }

    if (e.type === 'tileDropped') {
      if (classes.includes('active')) move();
      hiveEventEmitter.emit({ type: 'resetSelected' });
    }

    if (e.type === 'resetSelected') {
      setSelectedTile(null);
      setClasses({ type: 'remove', classes: ['can-drop', 'active'] });
    }
  }

  const hiveEventEmitter = useHiveEventEmitter(handleHiveEvent);

  function handleDragLeave(ev: { stopPropagation: () => void }) {
    ev.stopPropagation();
    setClasses({ type: 'remove', classes: ['active'] });
  }

  function handleDragEnter() {
    if (selectedTile) setClasses({ type: 'add', classes: ['active'] });
  }

  function handleClick(ev: { stopPropagation: () => void }) {
    if (selectedTile) {
      ev.stopPropagation();
      move();
      hiveEventEmitter.emit({ type: 'resetSelected' });
    }
  }

  function move() {
    if (selectedTile && isValidMove(selectedTile.moves))
      hiveEventEmitter.emit({
        type: 'move',
        move: { coords, tileId: selectedTile.id },
      });
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (!handleKeyboardNav(e) && isEnterOrSpace(e)) return handleClick(e);
  };

  const attributes = {
    className: classes.join(' '),
    ondragover: handleDragOver,
    ondragleave: handleDragLeave,
    ondragenter: handleDragEnter,
    onmouseover: handleDragEnter,
    onmouseout: handleDragLeave,
    onclick: handleClick,
    onkeydown: handleKeydown,
    tabindex: selectedTile && isValidMove(selectedTile.moves) ? 0 : undefined,
  };

  return <div {...attributes}>{tiles.length > 0 && <Tile {...tiles[0]} />}</div>;
};

CellFC.displayName = 'Cell';
export default memo(CellFC, (p, n) => deepEqual(p.coords, n.coords) && !p.tiles.length && !n.tiles.length);
