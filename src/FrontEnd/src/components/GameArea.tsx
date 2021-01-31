import {CellEvent, useCellEventEmitter} from '../emitters';
import {FunctionComponent, h} from 'preact';
import {GameState, MoveTile, PlayerId} from '../domain';
import {JSXInternal} from "preact/src/jsx";
import {handleDragOver} from '../handlers';
import {useEffect} from 'preact/hooks';
import Hextille from './Hextille';
import PlayerList from './PlayerList';

type Props = { gameState: GameState, moveTile: MoveTile }

const GameArea: FunctionComponent<Props> = ({ gameState, moveTile}) => {
    const cellEventEmitter = useCellEventEmitter();

    useEffect(() => {
        const cellEventListener = (e: CellEvent) => moveTile(gameState.gameId, e.move);
        cellEventEmitter.add(cellEventListener);

        return () => cellEventEmitter.remove(cellEventListener);
    }, [cellEventEmitter, gameState.gameId]);

    const attributes = {
        ondragover: handleDragOver,
        className: 'hive',
        style: {'--hex-size': '50px'} as JSXInternal.CSSProperties,
    };
    return (
        <div {...attributes}>
            <PlayerList players={gameState.players}/>
            <Hextille cells={gameState.cells}/>
        </div>
    );
};

GameArea.displayName = 'GameArea';
export default GameArea;
