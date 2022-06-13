import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { PlayerId, Tile as TileType } from '../domain';
import { TileAction } from '../services';
import { useClassReducer } from '../utilities/class-reducer';
import { useHiveDispatchListener, dispatchHiveEvent } from '../utilities/dispatcher';
import { handleDrop, handleKeyboardNav, isEnterOrSpace } from '../utilities/handlers';
import Tile from './Tile';

const tileSelector = `[tabindex].tile`;
const cellSelector = `[tabindex][role="cell"]`;
type Properties = TileType & { stacked?: boolean; currentPlayer: PlayerId };

const handleMouseLeave = (event: { currentTarget: HTMLElement }) => event.currentTarget.blur();

const GameTile: FunctionComponent<Properties> = (properties) => {
  const { currentPlayer, stacked, ...tile } = properties;
  const { id, moves, creature, playerId } = tile;
  const [focus, setFocus] = useState(tileSelector);
  const [classes, setClassList] = useClassReducer(`player${playerId} hex`);
  if (stacked) setClassList({ type: 'add', classes: ['stacked'] });

  const deselect = (fromEvent = false) => {
    if (!classes.includes('selected')) return;
    setClassList({ type: 'remove', classes: ['selected'] });
    dispatchHiveEvent({ type: 'tileDeselected', tile, fromEvent });
  };

  const select = (fromEvent = false) => {
    if (classes.includes('selected')) return;
    dispatchHiveEvent({ type: 'tileClear' });
    setClassList({ type: 'add', classes: ['selected'] });
    if (currentPlayer != playerId) return;
    dispatchHiveEvent({ type: 'tileSelected', tile, fromEvent });
  };

  useHiveDispatchListener<TileAction>('tileSelect', (event: TileAction) => {
    if (event.tile.id === id) select(true);
  });

  useHiveDispatchListener<TileAction>('tileDeselect', (event: TileAction) => {
    if (event.tile.id === id) deselect(true);
  });

  useHiveDispatchListener('tileClear', () => {
    deselect(true);
    setFocus('');
  });

  const handleDragStart = (event: DragEvent) => {
    event.stopPropagation();
    select();
    setClassList({ type: 'add', classes: ['before-drag'] });
    setTimeout(() => setClassList({ type: 'remove', classes: ['before-drag'] }), 1);
  };

  const handleDragEnd = () => {
    dispatchHiveEvent({ type: 'tileClear' });
    dispatchHiveEvent({ type: 'tileDropped', tile });
  };

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    return classes.includes('selected') ? deselect() : select();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (handleKeyboardNav(event) || !isEnterOrSpace(event)) return;
    event.stopPropagation();
    if (classes.includes('selected')) {
      deselect();
    } else {
      select();
      setFocus(cellSelector);
    }
  };
  useEffect(() => {
    if (!focus) return;
    const focusElement = document.querySelector<HTMLElement>(focus);
    focusElement?.focus();
    setFocus('');
  }, [focus]);

  const attributes = {
    title: `Player-${playerId} ${creature}`,
    class: classes,
    draggable: moves.length > 0 ? true : undefined,
    tabindex: moves.length > 0 ? 0 : undefined,
    creature,
  };

  const handlers =
    moves.length > 0
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
  return <Tile {...attributes} {...handlers} />;
};
GameTile.displayName = 'GameTile';
export default GameTile;
