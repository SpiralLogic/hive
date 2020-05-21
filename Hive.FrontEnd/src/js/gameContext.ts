import {createContext, useEffect, useState} from 'react';
import {Color, Hexagon, HexEngine, Move, Player, PlayerId} from './domain';
import TileDragEmitter from './emitter/tileDragEmitter';

export interface GameContext {
    
    players: Player[],
    hexagons: Hexagon[],
    moveTile: (move: Move) => void,
    getPlayerColor: (playerId: PlayerId) => Color,
    tileDragEmitter: TileDragEmitter;
}

export const HiveContext = createContext<GameContext>({
    hexagons: [],
    players: [],
    moveTile: () => undefined,
    getPlayerColor: (): string => 'red',
    tileDragEmitter: new TileDragEmitter()
});

const getPlayerColor = (playerId: PlayerId) => {
    const playerColors = ['#85dcbc', '#f64c72'];
    return playerColors[playerId] || 'red';
};

const tileDragEmitter = new TileDragEmitter();

export const useGameContext = (engine: HexEngine): [boolean, GameContext] => {
    const [loading, setLoading] = useState(true);
    const [hexagons, setHexagons] = useState<Hexagon[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        setLoading(true);
        engine.initialState().then(state => {
            setHexagons(state.hexagons);
            setPlayers(state.players);
            setLoading(false);
        });
    }, [engine]);

    const moveTile = (move: Move) => {
        engine.moveTile(move).then(state => {
            setHexagons(state.hexagons);
            setPlayers(state.players);
        });
    };

    return [loading, {hexagons, players, moveTile, getPlayerColor, tileDragEmitter}];
};

HiveContext.displayName = 'Hive Context';