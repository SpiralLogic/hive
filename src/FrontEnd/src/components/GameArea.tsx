import {CellDropEvent, useCellDropEmitter} from '../emitters';
import {FunctionComponent, h} from 'preact';
import {GameState, MoveTile, PlayerId} from '../domain';
import {JSXInternal} from "preact/src/jsx";
import {handleDragOver} from '../handlers';
import {useEffect} from 'preact/hooks';
import Hextille from './Hextille';
import PlayerList from './PlayerList';

type Props = { gameState: GameState, moveTile: MoveTile }

const GameArea: FunctionComponent<Props> = ({ gameState, moveTile}) => {
    const cellDropEmitter = useCellDropEmitter();

    useEffect(() => {
        const cellDropListener = (e: CellDropEvent) => moveTile(gameState.gameId, e.move);
        cellDropEmitter.add(cellDropListener);

        return () => cellDropEmitter.remove(cellDropListener);
    }, [cellDropEmitter, gameState.gameId]);

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
