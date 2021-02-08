import { Cell, HexCoordinates, Tile as TileType } from '../domain';
import { FunctionComponent, h } from 'preact';
import { HiveEvent, useHiveEventEmitter } from '../emitters';
import { deepEqual } from 'fast-equals';
import { handleDragOver } from '../handlers';
import { memo } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';
import Tile from './Tile';

type Props = Cell;

const CellFC: FunctionComponent<Props> = (props: Props) => {
  const { tiles, coords } = props;
  const hiveEventEmitter = useHiveEventEmitter();
  const isValidMove = (validMoves: HexCoordinates[]) =>
    validMoves.some((dest) => dest.q == coords.q && dest.r == coords.r);
  const [classes, setClasses] = useState(['hex', 'cell']);
  const [currentTile, setCurrentTile] = useState<TileType | null>(null);

  function handleDragLeave(ev: { stopPropagation: () => void }) {
    ev.stopPropagation();
    setClasses(classes.filter((e) => e !== 'active'));
  }

  function handleDragEnter(ev: { stopPropagation: () => void }) {
    if (currentTile) setClasses([...classes, 'active']);
  }

  function handleClickEvent(ev: { stopPropagation: () => void }) {
    if (currentTile) {
      ev.stopPropagation();
      move();
      hiveEventEmitter.emit({ type: 'deselect', tile: currentTile });
    }
  }

  function move() {
    if (currentTile) {
      if (isValidMove(currentTile.moves))
        hiveEventEmitter.emit({
          type: 'move',
          move: { coords, tileId: currentTile.id },
        });
      hiveEventEmitter.emit({ type: 'deselect', tile: currentTile });
    }
  }

  function handleHiveEvent(e: HiveEvent) {
    if (e.type === 'start') {
      const newClasses = isValidMove(e.tile.moves) ? [...classes, 'can-drop'] : ['hex', 'cell'];
      setCurrentTile(e.tile);
      setClasses(newClasses);
    } else if (e.type === 'end') {
      if (classes.includes('active')) move();
      if (currentTile) hiveEventEmitter.emit({ type: 'deselect', tile: currentTile });
    } else if (e.type === 'deselect') {
      setCurrentTile(null);
      setClasses(['hex', 'cell']);
    }
  }

  useEffect(() => {
    hiveEventEmitter.add(handleHiveEvent);
    return () => {
      hiveEventEmitter.remove(handleHiveEvent);
    };
  });

  const attributes = {
    className: classes.join(' '),
    ondragover: handleDragOver,
    ondragleave: handleDragLeave,
    ondragenter: handleDragEnter,
    onmouseenter: handleDragEnter,
    onmouseleave: handleDragLeave,
    onclick: handleClickEvent,
  };

  return <div {...attributes}>{tiles.length > 0 && <Tile {...tiles[0]} />}</div>;
};

CellFC.displayName = 'Cell';
export default memo(CellFC, (p, n) => deepEqual(p.coords, n.coords) && !p.tiles.length && !n.tiles.length);
