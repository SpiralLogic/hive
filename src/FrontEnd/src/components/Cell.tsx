import { Cell, HexCoordinates } from '../domain';
import { FunctionComponent, h } from 'preact';
import {
  TileDragEvent,
  useCellDropEmitter,
  useTileDragEmitter,
} from '../emitters';
import { deepEqual } from 'fast-equals';
import { handleDragOver } from '../handlers';
import { memo } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';
import Tile from './Tile';

type Props = Cell;

const CellFC: FunctionComponent<Props> = (props: Props) => {
  const { tiles, coords } = props;
  const [tileDragEmitter, cellDropEmitter] = [
    useTileDragEmitter(),
    useCellDropEmitter(),
  ];
  const isValidMove = (validMoves: HexCoordinates[]) =>
    validMoves.some((dest) => deepEqual(coords, dest));
  const [classes, setClasses] = useState('hex cell');

  function handleDragLeave(ev: { stopPropagation: () => void }) {
    ev.stopPropagation();
    setClasses(classes.replace(' active', ''));
  }

  function handleDragEnter(ev: { stopPropagation: () => void }) {
    ev.stopPropagation();
    setClasses(classes + ' active');
  }

  const handleTileEvent = (e: TileDragEvent) => {
    const valid = isValidMove(e.tile.moves);
    if (e.type === 'start' && valid) {
      setClasses(classes + ' can-drop');
    }

    if (e.type === 'end') {
      if (valid && classes.includes('active'))
        cellDropEmitter.emit({
          type: 'drop',
          move: { coords, tileId: e.tile.id },
        });

      setClasses('hex cell');
    }
  };

  useEffect(() => {
    tileDragEmitter.add(handleTileEvent);
    return () => tileDragEmitter.remove(handleTileEvent);
  });

  const attributes = {
    className: classes,
    ondragover: handleDragOver,
    ondragleave: handleDragLeave,
    ondragenter: handleDragEnter,
  };

  return (
    <div {...attributes}>
      {tiles.map((t) => (
        <Tile {...t} />
      ))}
    </div>
  );
};

CellFC.displayName = 'Cell';
export default memo(
  CellFC,
  (p, n) => deepEqual(p.coords, n.coords) && !p.tiles.length && !n.tiles.length
);
