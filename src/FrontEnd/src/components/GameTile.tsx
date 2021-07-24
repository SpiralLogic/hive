import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { PlayerId, Tile as TileType } from '../domain';

import { TileAction } from '../services';
import { addHiveDispatchListener, dispatchHiveEvent } from '../utilities/dispatcher';
import { handleDrop, handleKeyboardNav, isEnterOrSpace } from '../utilities/handlers';
import { useClassReducer } from '../utilities/class-reducer';
import Tile from './Tile';

const tileSelector = `[tabindex].tile`;
const cellSelector = `[tabindex][role="cell"]`;
type Props = TileType & { stacked?: boolean; currentPlayer: PlayerId };

const GameTile: FunctionComponent<Props> = (props) => {
  const { currentPlayer, stacked, ...tile } = props;
  const { id, moves, creature, playerId } = tile;
  const [focus, setFocus] = useState(tileSelector);
  const [classes, setClassList] = useClassReducer(`player${playerId} hex`);
  if (stacked) setClassList({ type: 'add', classes: ['stacked'] });

  const deselect = (fromEvent: boolean = false) => {
    if (!classes.includes('selected')) return;
    setClassList({ type: 'remove', classes: ['selected'] });
    dispatchHiveEvent({ type: 'tileDeselected', tile, fromEvent });
  };

  const select = (fromEvent: boolean = false) => {
    if (classes.includes('selected')) return;
    dispatchHiveEvent({ type: 'tileClear' });
    setClassList({ type: 'add', classes: ['selected'] });
    if (currentPlayer != tile.playerId) return;
    dispatchHiveEvent({ type: 'tileSelected', tile, fromEvent });
  };

  addHiveDispatchListener<TileAction>('tileSelect', (event: TileAction) => {
    if (event.tile.id === id) select(true);
  });

  addHiveDispatchListener<TileAction>('tileDeselect', (event: TileAction) => {
    if (event.tile.id === id) deselect(true);
  });

  addHiveDispatchListener('tileClear', () => {
    deselect(true);
    setFocus('');
  });

  const handleDragStart = (event: DragEvent) => {
    event.stopPropagation();
    select();
    setClassList({ type: 'add', classes: ['beforeDrag'] });
    setTimeout(() => setClassList({ type: 'remove', classes: ['beforeDrag'] }), 1);
  };

  const handleDragEnd = () => {
    dispatchHiveEvent({ type: 'tileClear' });
    dispatchHiveEvent({ type: 'tileDropped', tile });
  };

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    return classes.includes('selected') ? deselect() : select();
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
    const focusElement = document.querySelector<HTMLElement>(focus);
    focusElement?.focus();
    setFocus('');
  }, [focus]);

  const attributes = {
    title: `Player-${playerId} ${creature}`,
    class: classes,
    draggable: moves.length ? true : undefined,
    tabindex: moves.length ? 0 : undefined,
    creature,
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
  return <Tile {...attributes} {...handlers} />;
};
GameTile.displayName = 'GameTile';
export default GameTile;
