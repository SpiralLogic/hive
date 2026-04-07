import { Tile as TileType, TileMapKey } from '../domain';
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

/** Matches creatures.svg #hex after translate(2.5,0) scale(.95,1); used only while dragging for drag preview. */
const tileDragClipPath = 'polygon(2.5% 25%, 50% 0%, 97.5% 25%, 97.5% 75%, 50% 100%, 2.5% 75%)';
type Properties = Omit<TileType, 'moves'> & { stacked?: boolean; currentPlayer: number };

const handleMouseLeave = (event: { currentTarget: HTMLElement }) => {
  event.currentTarget.blur();
};

const GameTile = (properties: Properties) => {
  const { currentPlayer, stacked, ...tile } = properties;
  const { id, creature, playerId } = tile;
  const tileMoveState = useComputed(() => {
    const key = `${playerId}-${id}` as TileMapKey;
    const mapHasKey = moveMap.value.has(key);
    const coords = moveMap.value.get(key);
    const hasAvailableMoves = currentPlayer === playerId && !!coords?.length;
    return {
      mapHasKey,
      hasAvailableMoves,
      tabIndex: (hasAvailableMoves ? 0 : undefined) as 0 | undefined,
    };
  });
  const draggable = useComputed(() => tileMoveState.value.hasAvailableMoves);
  const tabIndex = useComputed<0 | undefined>(() => tileMoveState.value.tabIndex);
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
    const { mapHasKey, hasAvailableMoves } = tileMoveState.peek();
    if (playerId !== currentPlayer || !mapHasKey || !hasAvailableMoves) return;
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
      (event.currentTarget as HTMLElement).style.clipPath = tileDragClipPath;
      select();
      classesAction.add('before-drag');
    },
    (event: DragEvent) => {
      (event.currentTarget as HTMLElement).style.clipPath = '';
      classesAction.remove('before-drag');
      dispatcher.dispatch({ type: 'tileDropped', tile });
      dispatcher.dispatch({ type: 'tileClear' });
    }
  );

  const attributes = {
    title: `Player-${playerId} ${creature}`,
    draggable,
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
