import { FunctionComponent, h } from 'preact';
import { HiveEvent } from '../hive-event-emitter';
import { Tile } from '../domain';
import { deepEqual } from 'fast-equals';
import { handleDrop, handleKeyboardNav, isEnterOrSpace } from '../handlers';
import { memo } from 'preact/compat';
import { useClassReducer, useHiveEventEmitter } from '../hooks';
import { useLayoutEffect, useState } from 'preact/hooks';

type Props = Tile;

const TileFC: FunctionComponent<Props> = (props: Props) => {
  const [focus, setFocus] = useState('tile');
  const { moves, creature, playerId } = props;
  const [classList, setClassList] = useClassReducer([`player${playerId}`, 'hex', 'tile']);

  function handleHiveEvent(event: HiveEvent) {
    if (!(event.type === 'resetSelected')) return;
    setClassList({ type: 'remove', classes: ['selected'] });
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
  }, [moves.length, classList, focus]);

  const handleDragStart = () => {
    hiveEventEmitter.emit({ type: 'resetSelected' });
    hiveEventEmitter.emit({ type: 'tileSelected', tile: props });
    setClassList({ type: 'add', classes: ['beforeDrag', 'selected'] });
    setTimeout(() => setClassList({ type: 'remove', classes: ['beforeDrag'] }), 1);
  };

  const handleDragEnd = () => {
    hiveEventEmitter.emit({ type: 'resetSelected' });
    hiveEventEmitter.emit({ type: 'tileDropped', tile: props });
  };

  const handleClick = (ev: { target: HTMLElement; stopPropagation: () => void }) => {
    hiveEventEmitter.emit({ type: 'resetSelected' });
    if (classList.includes('selected')) return;
    setClassList({ type: 'add', classes: ['selected'] });
    setFocus('');
    hiveEventEmitter.emit({ type: 'tileSelected', tile: props });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (handleKeyboardNav(e) || !isEnterOrSpace(e)) return;
    e.stopPropagation();
    const isSelected = classList.includes('selected');
    hiveEventEmitter.emit({ type: 'resetSelected' });
    if (!isSelected) {
      hiveEventEmitter.emit({ type: 'tileSelected', tile: props });
      setFocus('can-drop');
      setClassList({ type: 'add', classes: ['selected'] });
    }
  };

  const attributes = {
    title: creature,
    class: classList.join(' '),
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
      <g {...attributes} {...handlers} transform="scale(.8)  translate(12.5,12.5)" >
        <use href={`#hex`} />
        <use class="creature" transform="scale(.7) translate(20,20)" href={`#${creature.toLowerCase()}`} />
      </g>
  );
};
TileFC.displayName = 'Tile';
export default memo(TileFC, deepEqual);
