import {ComponentChildren} from 'preact';
import {useRef} from 'preact/hooks';
import {HexCoordinate, Tile as TileType} from '../domain';
import {MoveEvent, TileEvent} from '../services';
import {handleDragOver} from '../utilities/handlers';
import Hexagon from './Hexagon';
import {useClassSignal} from '../hooks/useClassSignal';
import {useDispatcher, useHiveDispatchListener} from '../hooks/useHiveDispatchListener';
import {useSignal} from '@preact/signals';
import {moveMap} from '../services/gameStateContext';
import {useClickAndKeyDownHandler} from "../hooks/useClickAndKeyDownHandler";
import {useDragEnterLeaveHandlers} from "../hooks/useDragHandlers";
import {useHide} from "../hooks/useAnimatedHide";

const isValidMove = (coords: HexCoordinate, validMoves: Array<HexCoordinate> = []) =>
    validMoves.some((destination) => destination.q == coords.q && destination.r == coords.r);

type Properties = {
    coords: HexCoordinate;
    historical?: boolean;
    hidden?: boolean;
    children?: ComponentChildren;
};
const GameCell = (properties: Properties) => {
    const {coords, children, historical = false, hidden = false} = properties;
    const [classes, classActions] = useClassSignal('hide');
    const tabIndex = useSignal<-1 | 0>(-1);
    historical ? classActions.add('historical') : classActions.remove('historical');

    const selectedTile = useRef<Omit<TileType, 'moves'> | null>(null);
    const dispatcher = useDispatcher();

    useHiveDispatchListener<TileEvent>('tileDeselected', () => {
        if (selectedTile.current !== null) selectedTile.current = null;
        classActions.remove('active', 'can-drop', 'no-drop');
        tabIndex.value = -1;
    });

    useHide(hidden, [classes, classActions]);

    useHiveDispatchListener<TileEvent>('tileSelected', (intent) => {
        if (classes.value.includes('hide')) return;
        selectedTile.current = intent.tile;
        if (isValidMove(coords, moveMap.value.get(`${intent.tile.playerId}-${intent.tile.id}`))) {
            classActions.add('can-drop');
            tabIndex.value = 0;
        } else {
            classActions.add('no-drop');
        }
    });

    useHiveDispatchListener<TileEvent>('tileDropped', () => {
        if (
            classes.value.includes('active') &&
            selectedTile.current &&
            isValidMove(coords, moveMap.value.get(`${selectedTile.current.playerId}-${selectedTile.current.id}`))
        ) {
            dispatcher.dispatch({
                type: 'move',
                move: {coords, tileId: selectedTile.current.id},
            });
        } else {
            classActions.remove('active');
        }
    });
    const {handleDragEnter, handleDragLeave} = useDragEnterLeaveHandlers(() => {
        if (selectedTile.current) classActions.add('active');
    }, (event: DragEvent) => {
        event.stopPropagation();
        classActions.remove('active');
    })

    const {handleClick, handleKeyDown} = useClickAndKeyDownHandler((event: UIEvent) => {
        if (
            !(
                selectedTile.current &&
                isValidMove(coords, moveMap.value.get(`${selectedTile.current.playerId}-${selectedTile.current.id}`))
            )
        )
            return;
        event.stopPropagation();
        const move: MoveEvent = {type: 'move', move: {coords, tileId: selectedTile.current?.id}};
        dispatcher.dispatch({type: 'tileClear', tile: selectedTile.current});
        dispatcher.dispatch(move);
    });


    const attributes = {
        classes,
        role: 'cell' as const,
        tabIndex,
    };

    const handlers = {
        ondragover: handleDragOver,
        ondragleave: handleDragLeave,
        ondragenter: handleDragEnter,
        onmouseenter: handleDragEnter,
        onmouseleave: handleDragLeave,
        onclick: handleClick,
        onkeydown: handleKeyDown,
    };
    return (
        <Hexagon hidden={hidden} {...attributes} {...handlers}>
            {children}
        </Hexagon>
    );
};
GameCell.displayName = 'GameCell';
export default GameCell;
