import { FunctionComponent, h } from 'preact';
import { HiveEvent } from '../emitters';
import { JSXInternal } from 'preact/src/jsx';
import { PlayerId, Tile } from '../domain';
import { deepEqual } from 'fast-equals';
import { handleDrop, handleKeyboardClick } from '../handlers';
import { memo } from 'preact/compat';
import { useFocusEffect, useHiveEventEmitter } from '../hooks';
import { useState } from 'preact/hooks';

const getPlayerColor = (playerId: PlayerId) => {
  const playerColors = [
    ['rgb(255 238 11 )', 'black', '#7fff0088'],
    ['black', 'rgb(255 238 11 )', '#8a2be288'],
  ];
  return playerColors[playerId];
};

type Props = Tile;
const TileFC: FunctionComponent<Props> = (props: Props) => {
  const [selected, setSelected] = useState(false);
  const { moves, creature, playerId } = props;

  function handleHiveEvent(event: HiveEvent) {
    if (event.type === 'deselect' && selected) {
      setSelected(false);
    }
  }

  const hiveEventEmitter = useHiveEventEmitter(handleHiveEvent);

  useFocusEffect([selected ? 2 : 1, 3], [moves.length, selected]);

  function handleDragStart() {
    hiveEventEmitter.emit({ type: 'start', tile: props });
    setSelected(true);
  }

  function handleClick(ev: { stopPropagation: () => void }) {
    ev.stopPropagation();
    hiveEventEmitter.emit({ type: 'deselect' });

    setSelected(true);
    hiveEventEmitter.emit({ type: 'start', tile: props });
  }

  function handleDragEnd() {
    hiveEventEmitter.emit({ type: 'deselect' });
    hiveEventEmitter.emit({ type: 'end', tile: props });
  }

  const [color, fill, shadow] = getPlayerColor(playerId);

  const style = {
    '--color': color,
    fill,
    'box-shadow': selected ? `0px -10px 20px 5px ${shadow}, 0px 10px 20px 5px ${shadow}` : '',
  } as JSXInternal.CSSProperties;

  const attributes = {
    title: creature,
    style,
    class: selected ? 'hex tile jiggle' : 'hex tile',
    draggable: !!moves.length,
    ondrop: handleDrop,
    tabIndex: moves.length ? 1 : -1,
  };

  const handlers = attributes.draggable
    ? {
        onclick: handleClick,
        ondragstart: handleDragStart,
        ondragend: handleDragEnd,
        onkeydown: handleKeyboardClick,
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
