import { createContext, useContext, useEffect, useState } from 'react';
import { Hexagon, Move, Player } from './domain';
import TileDragEmitter from './emitter/tile-drag-emitter';
import { Engine } from './game-engine';

interface GameContext {
    players: Player[];
    hexagons: Hexagon[];
    moveTile: (move: Move) => void;
}

export const useNewHiveContext = (): [boolean, GameContext] => {
    const [loading, setLoading] = useState(true);
    const [hexagons, setHexagons] = useState<Hexagon[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        Engine.initialState()
            .then((state) => {
                setHexagons(state.hexagons);
                setPlayers(state.players);
                return setLoading(false);
            })
            .catch((reason) => {
                throw new Error(reason);
            });
    }, []);
    const moveTile = (move: Move) => {
        Engine.moveTile(move)
            .then((state) => {
                setHexagons(state.hexagons);
                return setPlayers(state.players);
            })
            .catch((reason) => {
                throw new Error(reason);
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
export const useHiveContext = () => useContext(HiveContext);
HiveContext.displayName = 'Hive Context';
