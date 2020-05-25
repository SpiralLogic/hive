import React from 'preact/compat';
import { GameArea } from './GameArea';
import { HiveContext, useNewHiveContext } from '../game-context';

const App = () => {
    const [loading, gameContext] = useNewHiveContext();
    return (
        <HiveContext.Provider value={gameContext!}>
            <GameArea loading={loading}/>
        </HiveContext.Provider>
    );
};

export default App;
