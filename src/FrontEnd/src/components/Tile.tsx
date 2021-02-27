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

const TileFC: FunctionComponent<Props> = (tile: Props) => {
  const [focus, setFocus] = useState(tileSelector);
  const { id, moves, creature, playerId } = tile;
  const [classList, setClassList] = useClassReducer([`player${playerId}`, 'hex', 'tile']);

  const handleHiveEvent = (event: HiveEvent) => {
    if (event.type === 'tileClear') {
      if (classList.includes('selected')) {
        hiveEventEmitter.emit({ type: 'tileDeselect', tile: tile });
      }
      setClassList({ type: 'remove', classes: ['selected'] });
      setFocus('');
    } else if (event.type === 'tileDeselect' && event.tile.id === id) {
      setClassList({ type: 'remove', classes: ['selected'] });
    } else if (event.type === 'tileSelect' && event.tile.id === id) {
      setClassList({ type: 'add', classes: ['selected'] });
    }
  };
  const hiveEventEmitter = useHiveEventEmitter(handleHiveEvent);
  useEffect(() => {
    if (!focus) return;
    const focusElement =
      document.querySelector<HTMLElement>(focus) || document.querySelector<HTMLElement>(playerSelector);
    focusElement?.focus();
    setFocus('');
  }, [focus]);

  const handleDragStart = () => {
    hiveEventEmitter.emit({ type: 'tileClear', tile: tile });
    hiveEventEmitter.emit({ type: 'tileSelect', tile: tile });
    setClassList({ type: 'add', classes: ['beforeDrag', 'selected'] });
    setTimeout(() => setClassList({ type: 'remove', classes: ['beforeDrag'] }), 1);
  };
  const handleDragEnd = () => {
    hiveEventEmitter.emit({ type: 'tileClear', tile: tile });
    hiveEventEmitter.emit({ type: 'tileDropped', tile: tile });
  };
  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    const isSelected = classList.includes('selected');
    if (!isSelected) {
      hiveEventEmitter.emit({ type: 'tileClear', tile: tile });
      hiveEventEmitter.emit({ type: 'tileSelect', tile: tile });
    } else {
      hiveEventEmitter.emit({ type: 'tileDeselect', tile: tile });
    }
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    if (handleKeyboardNav(e) || !isEnterOrSpace(e)) return;
    e.stopPropagation();
    const isSelected = classList.includes('selected');
    if (!isSelected) {
      hiveEventEmitter.emit({ type: 'tileClear', tile: tile });
      hiveEventEmitter.emit({ type: 'tileSelect', tile: tile });
      setFocus(cellSelector);
    } else {
      hiveEventEmitter.emit({ type: 'tileDeselect', tile: tile });
    }
  };
  const handleMouseLeave = (event: { currentTarget: HTMLElement }) => event.currentTarget.blur();

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
        onmouseleave: handleMouseLeave,
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
