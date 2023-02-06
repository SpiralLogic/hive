import { FunctionComponent } from 'preact';
import { useCallback, useContext, useEffect } from 'preact/hooks';

import { PlayerId, Tile as TileType } from '../domain';
import { TileAction } from '../services';
import { handleDrop, handleKeyboardNav, isEnterOrSpace } from '../utilities/handlers';
import Tile from './Tile';
import { useClassSignal } from '../hooks/useClassReducer';
import { Dispatcher, useHiveDispatchListener } from '../hooks/useHiveDispatchListener';
import { effect, signal, useSignal } from '@preact/signals';

const tileSelector = `[tabindex].tile`;
const cellSelector = `[role="cell"].can-drop`;
type Properties = TileType & { stacked?: boolean; currentPlayer: PlayerId };

const handleMouseLeave = (event: { currentTarget: HTMLElement }) => {
  event.currentTarget.blur();
};

const GameTile: FunctionComponent<Properties> = (properties) => {
  const { currentPlayer, stacked, ...tile } = properties;
  const { id, moves, creature, playerId } = tile;
  const focus = useSignal(tileSelector);
  const [classes, classAction] = useClassSignal(`player${playerId}`, 'hex');
  const dispatcher = useContext(Dispatcher);
  if (stacked) classAction.add('stacked');

  const deselect = (fromEvent = false) => {
    if (!classes.peek().includes('selected')) return;
    classAction.remove('selected');
    dispatcher.dispatch({ type: 'tileDeselected', tile, fromEvent });
  };

  const select = (fromEvent = false) => {
    if (classes.value.includes('selected')) return;
    dispatcher.dispatch({ type: 'tileClear' });
    classAction.add('selected');
    if (currentPlayer != playerId) return;
    dispatcher.dispatch({ type: 'tileSelected', tile, fromEvent });
    focus.value = cellSelector;
  };

  useHiveDispatchListener<TileAction>('tileSelect', (event: TileAction) => {
    if (event.tile.id === id) select(true);
  });

  useHiveDispatchListener<TileAction>('tileDeselect', (event: TileAction) => {
    if (event.tile.id === id) deselect(true);
  });

  useHiveDispatchListener('tileClear', () => {
    deselect(true);
  });

  const handleDragStart = (event: DragEvent) => {
    event.stopPropagation();
    select();
    classAction.add('before-drag');
    setTimeout(() => classAction.remove('before-drag'), 1);
  };

  const handleDragEnd = () => {
    dispatcher.dispatch({ type: 'tileDropped', tile });
    dispatcher.dispatch({ type: 'tileClear' });
  };

  const handleClick = (event: UIEvent & { currentTarget: HTMLElement }) => {
    event.stopPropagation();
    if (classes.peek().includes('selected')) {
      deselect();
      event.currentTarget.focus();
    } else {
      select();
    }
  };

  const handleKeyDown = (event: KeyboardEvent & { currentTarget: HTMLElement }) => {
    if (handleKeyboardNav(event) || !isEnterOrSpace(event)) return;
    handleClick(event);
  };
  useEffect(() => {
    return effect(() => {
      if (!focus.value) return;
      const focusElement = document.querySelector<HTMLElement>(focus.value);
      focusElement?.focus();
      focus.value = '';
    });
  }, [focus]);

  const attributes = {
    title: `Player-${playerId} ${creature}`,
    draggable: moves.length > 0 ? true : undefined,
    creature,
    canTabTo: signal(moves.length > 0),
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
          ondrop: useCallback(handleDrop, []),
        };
  return <Tile classes={classes} {...attributes} {...handlers} />;
};
GameTile.displayName = 'GameTile';
export default GameTile;
