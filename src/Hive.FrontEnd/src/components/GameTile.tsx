import { FunctionComponent } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';

import { PlayerId, Tile as TileType } from '../domain';
import { TileAction } from '../services';
import { handleDrop, handleKeyboardNav, isEnterOrSpace } from '../utilities/handlers';
import Tile from './Tile';
import { useClassSignal } from '../hooks/useClassReducer';
import { Dispatcher, useHiveDispatchListener } from '../hooks/useHiveDispatchListener';
import { signal, useSignal } from '@preact/signals';

const tileSelector = `[tabindex].tile`;
const cellSelector = `[role="cell"].can-drop`;
type Properties = TileType & { stacked?: boolean; currentPlayer: PlayerId };

const handleMouseLeave = (event: { currentTarget: HTMLElement }) => event.currentTarget.blur();

const GameTile: FunctionComponent<Properties> = (properties) => {
  const { currentPlayer, stacked, ...tile } = properties;
  const { id, moves, creature, playerId } = tile;
  const [focus, setFocus] = useState(tileSelector);
  const [classes, classAction] = useClassSignal(`player${playerId}`, 'hex');
  const dispatcher = useContext(Dispatcher);
  if (stacked) classAction.add('stacked');

  const deselect = (fromEvent = false) => {
    if (!classes.peek().includes('selected')) return;
    classAction.remove('selected');
    dispatcher.dispatch({ type: 'tileDeselected', tile, fromEvent });
  };

  const select = (fromEvent = false) => {
    if (classes.peek().includes('selected')) return;
    dispatcher.dispatch({ type: 'tileClear' });
    classAction.add('selected');
    if (currentPlayer != playerId) return;
    dispatcher.dispatch({ type: 'tileSelected', tile, fromEvent });
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
    classAction.add('before-drag');
    setTimeout(() => classAction.remove('before-drag'), 1);
  };

  const handleDragEnd = () => {
    dispatcher.dispatch({ type: 'tileDropped', tile });
    dispatcher.dispatch({ type: 'tileClear' });
  };

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    if (classes.peek().includes('selected')) {
      deselect();
    } else {
      select();
      setFocus(cellSelector);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (handleKeyboardNav(event) || !isEnterOrSpace(event)) return;
    event.stopPropagation();
    if (classes.peek().includes('selected')) {
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
    draggable: moves.length > 0 ? true : undefined,
    creature,
    canTabTo: signal(moves.length),
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
  return <Tile classes={classes} classAction={classAction} {...attributes} {...handlers} />;
};
GameTile.displayName = 'GameTile';
export default GameTile;
