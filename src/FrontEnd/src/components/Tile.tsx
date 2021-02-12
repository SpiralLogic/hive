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
    if (!(event.type === 'resetSelected')) return;
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
    hiveEventEmitter.emit({ type: 'tileSelected', tile: props });
    setSelected(true);
  };

  const handleDragEnd = () => {
    hiveEventEmitter.emit({ type: 'resetSelected' });
    hiveEventEmitter.emit({ type: 'tileDropped', tile: props });
  };

  const handleClick = (ev: { target: HTMLElement; stopPropagation: () => void }) => {
    ev.stopPropagation();
    hiveEventEmitter.emit({ type: 'resetSelected' });
    if (selected) return;
    setSelected(true);
    setFocus('');
    hiveEventEmitter.emit({ type: 'tileSelected', tile: props });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (handleKeyboardNav(e) || !isEnterOrSpace(e)) return;
    e.stopPropagation();
    const isSelected = selected;
    hiveEventEmitter.emit({ type: 'resetSelected' });
    if (!isSelected) {
      hiveEventEmitter.emit({ type: 'tileSelected', tile: props });
      setFocus('can-drop');
      setSelected(true);
    }
  };

  const attributes = {
    title: creature,
    class: `player${playerId} hex tile${selected ? ' selected' : ''}`,
    draggable: !!moves.length,
    ondrop: handleDrop,
    tabindex: moves.length ? 0 : undefined,
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
