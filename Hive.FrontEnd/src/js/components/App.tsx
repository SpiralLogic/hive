import * as React from 'react';
import { GameArea } from './GameArea';
import { HiveContext, useNewHiveContext } from '../game-context';

export const App = () => {
    const [loading, gameContext] = useNewHiveContext();
    return (
        <HiveContext.Provider value={gameContext!}>
            <GameArea loading={loading} />
        </HiveContext.Provider>
    );
};
