import * as React from 'react';
import { GameArea } from './GameArea';
import { HiveContext, useGameContext } from '../gameContext';

export const App = () => {
    const [loading, gameContext] = useGameContext();
    const { players, hexagons } = gameContext;
    return <HiveContext.Provider value={gameContext}>
        <GameArea loading={loading} players={players} hexagons={hexagons}/>
    </HiveContext.Provider>;
};
