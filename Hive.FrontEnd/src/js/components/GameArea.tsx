import { h } from 'preact';
import { useState } from 'preact/compat';
import { useEffect } from 'preact/hooks';
import { GameState } from '../domain';
import { CellDropEvent, useCellDropEmitter } from '../emitters/cell-drop-emitter';
import Engine from '../game-engine';
import { handleDragOver } from '../handlers';
import Hextille from './Hextille';
import PlayerList from './PlayerList';

const cellDropEmitter = useCellDropEmitter();

const GameArea = () => {
    const [gameState, setGameState] = useState<GameState | undefined>(undefined);

    const attributes = {
        ondragover: handleDragOver,
        className: 'hive',
        style: { '--hex-size': '50px' },
    };

    useEffect(() => {
        const fetch = (async () => {
            setGameState(await Engine.newGame());
        });
        fetch();
    }, []);

    useEffect(() => {
        const cellDropListener = async (e: CellDropEvent) => setGameState(await Engine.moveTile(e));

        cellDropEmitter.add(cellDropListener);
        return () => cellDropEmitter.remove(cellDropListener);
    }, [gameState]);

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
