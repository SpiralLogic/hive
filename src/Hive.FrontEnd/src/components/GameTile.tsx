import { Tile as TileType } from '../domain';
import { TileAction } from '../services';
import { handleDrop } from '../utilities/handlers';
import Tile from './Tile';
import { useClassSignal } from '../hooks/useClassSignal';
import { useDispatcher, useHiveDispatchListener } from '../hooks/useHiveDispatchListener';
import { useComputed } from '@preact/signals';
import { moveMap } from '../services/game-state-context.ts';
import { useFocusElement } from '../hooks/useFocusElement';
import { useClickAndKeyDownHandler } from '../hooks/useClickAndKeyDownHandler';
import { useDragHandlers } from '../hooks/useDragHandlers';

const tileSelector = `[tabindex].tile`;
const cellSelector = `[role="cell"].can-drop`;
type Properties = Omit<TileType, 'moves'> & { stacked?: boolean; currentPlayer: number };

const handleMouseLeave = (event: { currentTarget: HTMLElement }) => {
  event.currentTarget.blur();
};

const GameTile = (properties: Properties) => {
  const { currentPlayer, stacked, ...tile } = properties;
  const { id, creature, playerId } = tile;
  const availableMoveCount = useComputed(
    () => currentPlayer === playerId && !!moveMap.value.get(`${playerId}-${id}`)?.length
  );
  const tabIndex = useComputed<0 | undefined>(() =>
    currentPlayer === playerId && !!moveMap.value.get(`${playerId}-${id}`)?.length ? 0 : undefined
  );
  const [classes, classesAction] = useClassSignal(`player${playerId}`, 'hex');
  const focus = useFocusElement(tileSelector);
  const dispatcher = useDispatcher();
  if (stacked) classesAction.add('stacked');

  const deselect = (fromEvent = false) => {
    if (!classes.peek().includes('selected')) return;
    classesAction.remove('selected');
    dispatcher.dispatch({ type: 'tileDeselected', tile, fromEvent });
  };

  const select = (fromEvent = false) => {
    if (classes.peek().includes('selected')) return;
    dispatcher.dispatch({ type: 'tileClear' });
    classesAction.add('selected');
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

  const { handleClick, handleKeyDown } = useClickAndKeyDownHandler((event) => {
    if (playerId !== currentPlayer || !moveMap.value.has(`${playerId}-${id}`) || !availableMoveCount.value)
      return;
    event.stopPropagation();
    if (classes.peek().includes('selected')) {
      deselect();
      event.currentTarget.focus();
    } else {
      select();
    }
  });

  const { handleDragStart, handleDragEnd } = useDragHandlers(
    (event: DragEvent) => {
      event.stopPropagation();
      select();
      classesAction.add('before-drag');
    },
    () => {
      classesAction.remove('before-drag');
      dispatcher.dispatch({ type: 'tileDropped', tile });
      dispatcher.dispatch({ type: 'tileClear' });
    }
  );

  const attributes = {
    title: `Player-${playerId} ${creature}`,
    draggable: availableMoveCount,
    creature,
    tabIndex,
  };

  const handlers = {
    onclick: handleClick,
    ondragstart: handleDragStart,
    ondragend: handleDragEnd,
    onkeydown: handleKeyDown,
    onmouseleave: handleMouseLeave,
    ondrop: handleDrop,
  };
  return <Tile classes={classes} {...attributes} {...handlers} />;
};
GameTile.displayName = 'GameTile';
export default GameTile;
