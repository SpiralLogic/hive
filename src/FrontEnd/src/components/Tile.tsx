import { FunctionComponent, h } from 'preact';
import { HiveEvent } from '../hive-event-emitter';
import { Tile } from '../domain';
import { deepEqual } from 'fast-equals';
import { handleDrop, handleKeyboardNav, isEnterOrSpace } from '../handlers';
import { memo } from 'preact/compat';
import { useHiveEventEmitter } from '../hooks';
import { useLayoutEffect, useState } from 'preact/hooks';

type Props = Tile;

const TileFC: FunctionComponent<Props> = (props: Props) => {
  const [selected, setSelected] = useState(false);
  const [focus, setFocus] = useState('tile');
  const { moves, creature, playerId } = props;

  function handleHiveEvent(event: HiveEvent) {
    if (!(event.type === 'deselect')) return;
    setSelected(false);
    setFocus('');
  }

  const hiveEventEmitter = useHiveEventEmitter(handleHiveEvent);

  useLayoutEffect(() => {
    if (!focus) return;
    const focusElement =
      document.querySelector<HTMLElement>(`[tabIndex].${focus}`) ||
      document.querySelector<HTMLElement>(`[tabIndex].name`);

    focusElement?.focus();
    setFocus('');
  }, [moves.length, selected, focus]);

  const handleDragStart = () => {
    hiveEventEmitter.emit({ type: 'start', tile: props });
    setSelected(true);
  };

  const handleClick = (ev: { target: HTMLElement; stopPropagation: () => void }) => {
    ev.stopPropagation();
    hiveEventEmitter.emit({ type: 'deselect' });
    if (selected) return;
    setSelected(true);
    setFocus('');
    hiveEventEmitter.emit({ type: 'start', tile: props });
  };

  const handleDragEnd = () => {
    hiveEventEmitter.emit({ type: 'deselect' });
    hiveEventEmitter.emit({ type: 'end', tile: props });
  };

  const attributes = {
    title: creature,
    class: `player${playerId} hex tile${selected ? ' selected' : ''}`,
    draggable: !!moves.length,
    ondrop: handleDrop,
    tabindex: moves.length ? 0 : undefined,
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (handleKeyboardNav(e) || !isEnterOrSpace(e)) return;
    e.stopPropagation();
    const isSelected = selected;
    hiveEventEmitter.emit({ type: 'deselect' });
    if (!isSelected) {
      hiveEventEmitter.emit({ type: 'start', tile: props });
      setFocus('can-drop');
      setSelected(true);
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
