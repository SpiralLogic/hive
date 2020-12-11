import {CellDropEvent, useCellDropEmitter} from '../emitters';
import {GameState} from '../domain';
import {HubConnectionBuilder} from "@microsoft/signalr";
import {JSXInternal} from "preact/src/jsx";
import {h} from 'preact';
import {handleDragOver} from '../handlers';
import {useEffect, useState} from 'preact/hooks';
import Engine from '../game-engine';
import Hextille from './Hextille';
import PlayerList from './PlayerList';

const GameArea = () => {
    const [gameState, setGameState] = useState<GameState | undefined>(undefined);
    const cellDropEmitter = useCellDropEmitter();

    const attributes = {
        ondragover: handleDragOver,
        className: 'hive',
        style: {'--hex-size': '50px'} as JSXInternal.CSSProperties,
    };

    useEffect(() => {
        return Engine.onUpdate(setGameState);
    }, []);

    useEffect(() => {
        const fetch = async () => {
            setGameState(await Engine.newGame());
        };
        fetch().then();
    }, []);

    useEffect(() => {
        const cellDropListener = (e: CellDropEvent) => Engine.moveTile(e.move);

        cellDropEmitter.add(cellDropListener);
        return () => cellDropEmitter.remove(cellDropListener);
    }, [cellDropEmitter, gameState]);

    if (!gameState) {
        return <h1>loading !</h1>;
    }

    return (
        <div {...attributes}>
            <PlayerList players={gameState.players}/>
            <Hextille cells={gameState.cells}/>
        </div>
    );
};

GameArea.displayName = 'GameArea';
export default GameArea;
