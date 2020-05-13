import { createContext, useEffect, useState } from 'react';
import { Color, GameState, HexEngine, Move, PlayerId } from './domain';

export interface GameContext {
    gameState: GameState;
    moveTile: (move: Move) => void;
    getPlayerColor: (playerId: PlayerId) => Color;
}

export const Context = createContext<GameContext>({
    gameState: {
        hexagons: [],
        players: [],
    },
    moveTile: () => undefined,
    getPlayerColor: (): string => '',
});

const getPlayerColor = (playerId: PlayerId) => {
    const playerColors = ['#85dcbc', '#f64c72'];
    return playerColors[playerId] || 'red';
};

export const useGameContext = (engine: HexEngine): [boolean, GameContext] => {
    const [loading, setLoading] = useState(true);

    const [gameState, setGameState] = useState<GameState>({
        hexagons: [],
        players: [],
    });

    useEffect(() => {
        setLoading(true);
        engine.initialState().then(state => {
            setGameState(state);
            setLoading(false);
        });
    }, [engine]);

    const moveTile = (move: Move) => {
        engine.moveTile(move).then(nextState => setGameState(nextState));
    };

    return [loading, { gameState, moveTile, getPlayerColor }];
};
