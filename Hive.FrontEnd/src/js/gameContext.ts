import { createContext, useEffect, useReducer, useState } from 'react';
import { Color, Hexagon, HexEngine, Move, Player, PlayerId } from './domain';
import TileDragEmitter from './emitter/tileDragEmitter';
import { Engine } from './index';

export interface GameContext {
    players: Player[],
    hexagons: Hexagon[],
    moveTile: (move: Move) => void,
}

export const HiveContext = createContext<GameContext>({
    hexagons: [],
    players: [],
    moveTile: () => undefined,
});

export const tileDragEmitter = new TileDragEmitter();

function reducer (prev: Hexagon[], next: Hexagon[]) {
    const added = next.filter(h => !prev.some(p => p.coordinates.q == h.coordinates.q && h.coordinates.r == p.coordinates.r && p.tiles.length === h.tiles.length));
    console.log(added,next);
    return prev.concat(added);
}

export const useGameContext = (): [boolean, GameContext] => {
    const [loading, setLoading] = useState(true);
    const [players, setPlayers] = useState<Player[]>([]);
    const [hexagons, setHexagons] = useReducer(reducer, [] as Hexagon[]);

    useEffect(() => {
        setLoading(true);
        Engine.initialState().then(state => {
            setHexagons(state.hexagons);
            setPlayers(state.players);
            setLoading(false);
        });
    }, [Engine]);

    const moveTile = (move: Move) => {
        Engine.moveTile(move).then(state => {
            setHexagons(state.hexagons);
            setPlayers(state.players);
        });
    };

    return [loading, { hexagons, players, moveTile }];
};

HiveContext.displayName = 'Hive Context';