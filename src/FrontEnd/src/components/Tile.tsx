import { FunctionComponent, h } from 'preact';
import { TileEvent } from '../hive-event-emitter';
import { Tile } from '../domain';
import { addHiveEventListener, useClassReducer, useHiveEventEmitter } from '../hooks';
import { deepEqual } from 'fast-equals';
import { handleDrop, handleKeyboardNav, isEnterOrSpace } from '../handlers';
import { memo } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';

type Props = Tile;
const tileSelector = `[tabindex].tile`;
const cellSelector = `[tabindex].cell`;
const playerSelector = `[tabindex].name`;

const TileFC: FunctionComponent<Props> = (tile: Props) => {
  const [focus, setFocus] = useState(tileSelector);
  const { id, moves, creature, playerId } = tile;
  const [classList, setClassList] = useClassReducer([`player${playerId}`, 'hex', 'tile']);
  const hiveEventEmitter = useHiveEventEmitter();

  addHiveEventListener('tileClear', () => {
    deselect();
    setFocus('');
  });
  addHiveEventListener<TileEvent>('tileSelect', (event: TileEvent) => {
    if (event.tile.id == id) select();
  });

  addHiveEventListener<TileEvent>('tileDeselect', (event: TileEvent) => {
    if (event.tile.id == id) deselect();
  });

  function deselect() {
    const isSelected = classList.includes('selected');
    if (isSelected) {
      setClassList({ type: 'remove', classes: ['selected'] });
      hiveEventEmitter.emit({ type: 'tileDeselected', tile: tile });
    }
  }
  const select = () => {
    const isSelected = classList.includes('selected');
    if (!isSelected) {
      hiveEventEmitter.emit({ type: 'tileClear' });
      setClassList({ type: 'add', classes: ['selected'] });
      hiveEventEmitter.emit({ type: 'tileSelected', tile: tile });
    }
  };
  useEffect(() => {
    if (!focus) return;
    const focusElement =
      document.querySelector<HTMLElement>(focus) || document.querySelector<HTMLElement>(playerSelector);
    focusElement?.focus();
    setFocus('');
  }, [focus]);

  const handleDragStart = (event: DragEvent) => {
    event.stopPropagation();
    select();
    setClassList({ type: 'add', classes: ['beforeDrag'] });
    setTimeout(() => setClassList({ type: 'remove', classes: ['beforeDrag'] }), 1);
  };
  const handleDragEnd = () => {
    hiveEventEmitter.emit({ type: 'tileClear' });
    hiveEventEmitter.emit({ type: 'tileDropped', tile: tile });
  };
  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    const isSelected = classList.includes('selected');
    if (!isSelected) {
      select();
    } else {
      deselect();
    }
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    if (handleKeyboardNav(e) || !isEnterOrSpace(e)) return;
    e.stopPropagation();
    const isSelected = classList.includes('selected');
    if (!isSelected) {
      select();
      setFocus(cellSelector);
    } else {
      deselect();
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
