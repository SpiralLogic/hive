import {GameArea} from './GameArea';
import {HiveContext, useNewHiveContext} from '../game-context';
import React from 'preact/compat';

const App = () => {
    const [loading, gameContext] = useNewHiveContext();

    if (loading) {
        return <h1>loading</h1>;
    }

    if (!gameContext || !gameContext.hexagons.length) {
        return <h1>Bad Times !</h1>;
    }

    return <HiveContext.Provider value={gameContext}><GameArea/></HiveContext.Provider>;
};

export default App;
