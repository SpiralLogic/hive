import * as React from 'react';
import { GameArea } from './GameArea';
import { HiveContext, createGameContext } from '../gameContext';

export const App = () => {
    const [loading, gameContext] = createGameContext();
    return <HiveContext.Provider value={gameContext}>
        <GameArea loading={loading}/>
    </HiveContext.Provider>;
};
