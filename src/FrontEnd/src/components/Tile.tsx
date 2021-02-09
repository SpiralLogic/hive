import { FunctionComponent, createRef, h } from 'preact';
import { HiveEvent, useHiveEventEmitter } from '../emitters';
import { JSXInternal } from 'preact/src/jsx';
import { PlayerId, Tile } from '../domain';
import { deepEqual } from 'fast-equals';
import { handleDrop } from '../handlers';
import { memo } from 'preact/compat';
import { useEffect, useLayoutEffect, useState } from 'preact/hooks';

const getPlayerColor = (playerId: PlayerId) => {
  const playerColors = [
    ['rgb(255 238 11 )', 'black', '#7fff0088'],
    ['black', 'rgb(255 238 11 )', '#8a2be288'],
  ];
  return playerColors[playerId] || 'red';
};

type Props = Tile;
const TileFC: FunctionComponent<Props> = (props: Props) => {
  const [selected, setSelected] = useState(false);
  const { moves, creature, playerId } = props;
  const hiveEventEmitter = useHiveEventEmitter();
  const tileRef = createRef();

  function handleDragStart() {
    hiveEventEmitter.emit({ type: 'start', tile: props });
    setSelected(true);
  }

  function handleClick(ev: { stopPropagation: () => void }) {
    ev.stopPropagation();
    hiveEventEmitter.emit({ type: 'deselect', tile: props });

    setSelected(true);
    hiveEventEmitter.emit({ type: 'start', tile: props });
  }

  function handleDragEnd() {
    hiveEventEmitter.emit({ type: 'deselect', tile: props });
    hiveEventEmitter.emit({ type: 'end', tile: props });
  }

  function handleHiveEvent(event: HiveEvent) {
    if (event.type === 'deselect' && selected) {
      setSelected(false);
    }
  }

  useEffect(() => {
    hiveEventEmitter.add(handleHiveEvent);
    return () => {
      hiveEventEmitter.remove(handleHiveEvent);
    };
  });

  useLayoutEffect(() => {
    const tabIndex = selected ? 2 : 1;
    document.querySelector<HTMLElement>(`[tabIndex="${tabIndex}"]`)?.focus();
  }, [moves.length, selected]);

  const [color, fill, shadow] = getPlayerColor(playerId);
  const attributes = {
    title: creature,
    style: {
      '--color': color,
      fill,
      'box-shadow': selected ? `0px -10px 20px 5px ${shadow}, 0px 10px 20px 5px ${shadow}` : '',
    } as JSXInternal.CSSProperties,
    class: selected ? 'hex tile jiggle' : 'hex tile',
    draggable: !!moves.length,
    ondrop: handleDrop,
    tabIndex: moves.length ? 1 : -1,
    ref: tileRef,
  };

  const handlers = attributes.draggable
    ? {
        onclick: handleClick,
        ondragstart: handleDragStart,
        ondragend: handleDragEnd,
        onkeydown: (e: KeyboardEvent) => (e.key === 'Enter' || e.key === ' ') && handleClick(e),
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
