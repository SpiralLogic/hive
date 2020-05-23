import { createContext, useContext, useEffect, useState } from 'react';
import { Hexagon, Move, Player } from './domain';
import TileDragEmitter from './emitter/tileDragEmitter';
import { Engine } from './engine';

interface GameContext {
    players: Player[],
    hexagons: Hexagon[],
    moveTile: (move: Move) => void,
}

export const createGameContext = (): [boolean, GameContext] => {
    const [loading, setLoading] = useState(true);
    const [hexagons, setHexagons] = useState<Hexagon[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        Engine.initialState().then(state => {
            setHexagons(state.hexagons);
            setPlayers(state.players);
            setLoading(false);
        });
    }, []);
    const moveTile = (move: Move) => {
        Engine.moveTile(move).then(state => {
            setHexagons(state.hexagons);
            setPlayers(state.players);
        });
    };

    return [loading, { hexagons, players, moveTile }];
};

export const HiveContext = createContext<GameContext>({
    hexagons: [],
    players: [],
    moveTile: () => undefined,
});
export const tileDragEmitter = new TileDragEmitter();
export const useGameContext = () => useContext(HiveContext);
HiveContext.displayName = 'Hive Context';