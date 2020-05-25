import { GameArea } from './GameArea';
import { HiveContext, useNewHiveContext } from '../game-context';
import * as React from 'preact/compat';

const App = () => {
    const [loading, gameContext] = useNewHiveContext();
    return (
        <HiveContext.Provider value={gameContext!}>
            <GameArea loading={loading}/>
        </HiveContext.Provider>
    );
};

export default App;
