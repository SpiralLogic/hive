import { FunctionComponent, h } from 'preact';
import { JSXInternal } from 'preact/src/jsx';
import { PlayerId, Tile } from '../domain';
import { deepEqual } from 'fast-equals';
import { handleDrop } from '../handlers';
import { memo } from 'preact/compat';
import { CellEvent, TileEvent, useTileEventEmitter } from '../emitters';
import { useEffect, useState } from 'preact/hooks';

const getPlayerColor = (playerId: PlayerId) => {
  const playerColors = [
    ['#85dcbc', 'chartreuse'],
    ['#f64c72', 'blueviolet'],
  ];
  return playerColors[playerId] || 'red';
};

type Props = Tile;
const TileFC: FunctionComponent<Props> = (props: Props) => {
  const [selected, setSelected] = useState(false);
  const { moves, creature, playerId } = props;
  const tileEventEmitter = useTileEventEmitter();

  function handleDragStart() {
    tileEventEmitter.emit({ type: 'start', tile: props });
    setSelected(true);
  }

  function handleClick(ev: { stopPropagation: () => void }) {
    ev.stopPropagation();
    tileEventEmitter.emit({ type: 'deselect', tile: props });

    setSelected(true);
    tileEventEmitter.emit({ type: 'start', tile: props });
  }

  function handleDragEnd() {
    tileEventEmitter.emit({ type: 'deselect', tile: props });
    tileEventEmitter.emit({ type: 'end', tile: props });
  }

  function handleTileEvent(e: TileEvent) {
    if (e.type === 'deselect' && selected) {
      setSelected(false);
    }
  }

  useEffect(() => {
    tileEventEmitter.add(handleTileEvent);
    return () => {
      tileEventEmitter.remove(handleTileEvent);
    };
  });

  const [color, shadow] = getPlayerColor(playerId);
  const attributes = {
    title: creature,
    style: {
      '--color': color,
      'box-shadow': selected
        ? `0px -15px 20px 5px ${shadow}, 0px 15px 20px 5px ${shadow}`
        : '',
    } as JSXInternal.CSSProperties,
    class: 'hex tile',
    draggable: !!moves.length,
    ondrop: handleDrop,
  };

  const handlers = attributes.draggable
    ? {
        onclick: handleClick,
        ondragstart: handleDragStart,
        ondragend: handleDragEnd,
      }
    : {};

  return (
    <div {...attributes} {...handlers}>
      <svg xmlns="http://www.w3.org/2000/svg">
        <use href={`#${creature.toLowerCase()}`} />
      </svg>
    </div>
  );
};

TileFC.displayName = 'Tile';
export default memo(TileFC, deepEqual);
