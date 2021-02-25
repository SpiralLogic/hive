import { FunctionComponent, h } from 'preact';
import { HiveEvent } from '../hive-event-emitter';
import { Tile } from '../domain';
import { deepEqual } from 'fast-equals';
import { handleDrop, handleKeyboardNav, isEnterOrSpace } from '../handlers';
import { memo } from 'preact/compat';
import { useClassReducer, useHiveEventEmitter } from '../hooks';
import { useEffect, useState } from 'preact/hooks';

type Props = Tile;
const tileSelector = `[tabindex].tile`;
const cellSelector = `[tabindex].cell`;
const playerSelector = `[tabindex].name`;

const TileFC: FunctionComponent<Props> = (props: Props) => {
  const [focus, setFocus] = useState(tileSelector);
  const { moves, creature, playerId } = props;
  const [classList, setClassList] = useClassReducer([`player${playerId}`, 'hex', 'tile']);

  function handleHiveEvent(event: HiveEvent) {
    if (event.type === 'resetSelected') {
      setClassList({ type: 'remove', classes: ['selected'] });
      setFocus('');
    }
  }

  const hiveEventEmitter = useHiveEventEmitter(handleHiveEvent);

  useEffect(() => {
    if (!focus) return;
    const focusElement =
      document.querySelector<HTMLElement>(focus) || document.querySelector<HTMLElement>(playerSelector);
    focusElement?.focus();
    setFocus('');
  }, [focus]);

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

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    const isSelected = classList.includes('selected');
    hiveEventEmitter.emit({ type: 'resetSelected' });
    if (!isSelected) {
      setClassList({ type: 'add', classes: ['selected'] });
      hiveEventEmitter.emit({ type: 'tileSelected', tile: props });
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (handleKeyboardNav(e) || !isEnterOrSpace(e)) return;
    e.stopPropagation();
    const isSelected = classList.includes('selected');
    hiveEventEmitter.emit({ type: 'resetSelected' });
    if (isSelected) return;
    hiveEventEmitter.emit({ type: 'tileSelected', tile: props });
    setClassList({ type: 'add', classes: ['selected'] });
    setFocus(cellSelector);
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
        onmouseleave: (event: { currentTarget: HTMLElement }) => event.currentTarget.blur(),
      }
    : {};

  return (
    <div {...attributes} {...handlers}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <use href="#hex" />
        <use class="creature" href={`#${creature.toLowerCase()}`} />
      </svg>
    </div>
  );
};
TileFC.displayName = 'Tile';
export default memo(TileFC, deepEqual);
