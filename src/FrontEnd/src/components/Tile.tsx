import { FunctionComponent, h } from 'preact';
import { HiveEvent } from '../emitters';
import { Tile } from '../domain';
import { deepEqual } from 'fast-equals';
import { handleDrop, handleKeyboardNav, isEnterOrSpace } from '../handlers';
import { memo } from 'preact/compat';
import { useHiveEventEmitter } from '../hooks';
import { useLayoutEffect, useState } from 'preact/hooks';

type Props = Tile;

const TileFC: FunctionComponent<Props> = (props: Props) => {
  const [selected, setSelected] = useState(false);
  const [focus, setFocus] = useState(1);
  const { moves, creature, playerId } = props;

  function handleHiveEvent(event: HiveEvent) {
    if (!(event.type === 'deselect' && selected)) return;
    setFocus(1);
    setSelected(false);
  }

  const hiveEventEmitter = useHiveEventEmitter(handleHiveEvent);

  useLayoutEffect(() => {
    if (selected && focus < 2) return;
    const selector = [focus, 3].map((t) => `[tabIndex="${t}"]`).join(',');
    Array.from(document.querySelectorAll<HTMLElement>(selector))
      .sort((e1, e2) => e1.tabIndex - e2.tabIndex)
      .shift()
      ?.focus();
  }, [moves.length, selected, focus]);

  function handleDragStart() {
    hiveEventEmitter.emit({ type: 'start', tile: props });
    setSelected(true);
  }

  function handleClick(ev: { stopPropagation: () => void }) {
    if (selected) return;
    ev.stopPropagation();
    hiveEventEmitter.emit({ type: 'deselect' });
    setSelected(true);
    setFocus(1);
    hiveEventEmitter.emit({ type: 'start', tile: props });
    return false;
  }

  function handleDragEnd() {
    hiveEventEmitter.emit({ type: 'deselect' });
    hiveEventEmitter.emit({ type: 'end', tile: props });
  }

  const attributes = {
    title: creature,
    class: `player${playerId} hex tile${selected ? ' selected' : ''}`,
    draggable: !!moves.length,
    ondrop: handleDrop,
    tabIndex: moves.length ? 1 : undefined,
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (handleKeyboardNav(e) || !isEnterOrSpace(e)) return;
    e.stopPropagation();
    hiveEventEmitter.emit({ type: 'deselect' });
    if (!selected) {
      setFocus(2);
      setSelected(true);
      hiveEventEmitter.emit({ type: 'start', tile: props });
    }
  };

  const handlers = attributes.draggable
    ? {
        onclick: handleClick,
        ondragstart: handleDragStart,
        ondragend: handleDragEnd,
        onkeydown: handleKeyDown,
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
