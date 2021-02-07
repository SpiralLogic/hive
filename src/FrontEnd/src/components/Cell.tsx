import { Cell, HexCoordinates, Tile as TileType } from '../domain';
import {
  CellEvent,
  CellMoveEvent,
  TileEvent,
  useCellEventEmitter,
  useTileEventEmitter,
} from '../emitters';
import { FunctionComponent, h } from 'preact';
import { deepEqual } from 'fast-equals';
import { handleDragOver } from '../handlers';
import { memo } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';
import Tile from './Tile';

type Props = Cell;

const CellFC: FunctionComponent<Props> = (props: Props) => {
  const { tiles, coords } = props;
  const [tileEventEmitter, cellEventEmitter] = [
    useTileEventEmitter(),
    useCellEventEmitter(),
  ];
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
    }
    cellEventEmitter.emit({ type: 'deselect' });
  }

  function move() {
    if (currentTile && isValidMove(currentTile.moves)) {
      cellEventEmitter.emit({
        type: 'drop',
        move: { coords, tileId: currentTile.id },
      } as CellMoveEvent);
    }
  }

  function handleTileEvent(e: TileEvent) {
    if (e.type === 'start') {
      const newClasses = isValidMove(e.tile.moves)
        ? [...classes, 'can-drop']
        : ['hex', 'cell'];
      setCurrentTile(e.tile);
      setClasses(newClasses);
    } else if (e.type === 'end') {
      if (classes.includes('active')) move();
      cellEventEmitter.emit({ type: 'deselect' });
    }
  }

  function handleCellEvent(e: CellEvent) {
    if (e.type === 'deselect') {
      setCurrentTile(null);
      setClasses(['hex', 'cell']);
    }
  }

  useEffect(() => {
    cellEventEmitter.add(handleCellEvent);
    tileEventEmitter.add(handleTileEvent);
    return () => {
      cellEventEmitter.remove(handleCellEvent);
      tileEventEmitter.remove(handleTileEvent);
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

  return (
    <div {...attributes}>{tiles.length > 0 && <Tile {...tiles[0]} />}</div>
  );
};

CellFC.displayName = 'Cell';
export default memo(
  CellFC,
  (p, n) => deepEqual(p.coords, n.coords) && !p.tiles.length && !n.tiles.length
);
