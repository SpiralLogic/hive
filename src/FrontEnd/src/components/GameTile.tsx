import { FunctionComponent, h } from 'preact';
import { TileAction } from '../utilities/hive-dispatcher';
import { Tile as TileType } from '../domain';
import { addHiveEventListener, useClassReducer, useHiveDispatcher } from '../utilities/hooks';
import { handleDrop, handleKeyboardNav, isEnterOrSpace } from '../utilities/handlers';
import { useEffect, useState } from 'preact/hooks';
import Tile from './Tile';

const tileSelector = `[tabindex].tile`;
const cellSelector = `[tabindex][role="cell"]`;
const playerSelector = `[tabindex].name`;

const GameTile: FunctionComponent<TileType> = (tile: TileType) => {
  const { id, moves, creature, playerId } = tile;
  const [focus, setFocus] = useState(tileSelector);
  const [classes, setClassList] = useClassReducer(`player${playerId} hex tile`);
  const hiveDispatcher = useHiveDispatcher();

  const deselect = () => {
    if (!classes.includes('selected')) return;
    setClassList({ type: 'remove', class: 'selected' });
    hiveDispatcher.dispatch({ type: 'tileDeselected', tile: tile });
  };

  const select = () => {
    if (classes.includes('selected')) return;
    hiveDispatcher.dispatch({ type: 'tileClear' });
    setClassList({ type: 'add', class: 'selected' });
    hiveDispatcher.dispatch({ type: 'tileSelected', tile: tile });
  };

  addHiveEventListener<TileAction>('tileSelect', (event: TileAction) => {
    if (event.tile.id === id) select();
  });

  addHiveEventListener<TileAction>('tileDeselect', (event: TileAction) => {
    if (event.tile.id === id) deselect();
  });

  addHiveEventListener('tileClear', () => {
    deselect();
    setFocus('');
  });

  const handleDragStart = (event: DragEvent) => {
    event.stopPropagation();
    select();
    setClassList({ type: 'add', class: 'beforeDrag' });
    setTimeout(() => setClassList({ type: 'remove', class: 'beforeDrag' }), 1);
  };
  const handleDragEnd = () => {
    hiveDispatcher.dispatch({ type: 'tileClear' });
    hiveDispatcher.dispatch({ type: 'tileDropped', tile: tile });
  };
  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    !classes.includes('selected') ? select() : deselect();
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    if (handleKeyboardNav(e) || !isEnterOrSpace(e)) return;
    e.stopPropagation();
    if (!classes.includes('selected')) {
      select();
      setFocus(cellSelector);
    } else {
      deselect();
    }
  };
  const handleMouseLeave = (event: { currentTarget: HTMLElement }) => event.currentTarget.blur();

  useEffect(() => {
    if (!focus) return;
    const focusElement =
      document.querySelector<HTMLElement>(focus) || document.querySelector<HTMLElement>(playerSelector);
    focusElement?.focus();
    setFocus('');
  }, [focus]);

  const attributes = {
    title: creature,
    class: classes || undefined,
    draggable: !!moves.length,
    tabindex: moves.length ? 0 : undefined,
  };
  const handlers = moves.length
    ? {
        onclick: handleClick,
        ondragstart: handleDragStart,
        ondragend: handleDragEnd,
        onkeydown: handleKeyDown,
        onmouseleave: handleMouseLeave,
        ondrop: handleDrop,
      }
    : {
        ondrop: handleDrop,
      };
  return <Tile creature={creature} {...attributes} {...handlers} />;
};
GameTile.displayName = 'Tile';
export default GameTile;
