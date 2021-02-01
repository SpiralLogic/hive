import {FunctionComponent, h} from 'preact';
import {GameState} from '../domain';
import {JSXInternal} from "preact/src/jsx";
import {handleDragOver} from '../handlers';
import Hextille from './Hextille';
import PlayerList from './PlayerList';

type Props = { gameState: GameState }

const GameArea: FunctionComponent<Props> = ({ gameState}) => {

    const attributes = {
        ondragover: handleDragOver,
        className: 'hive',
        style: {'--hex-size': '4vh'} as JSXInternal.CSSProperties,
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
