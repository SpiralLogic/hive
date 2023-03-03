import '../css/app.css';

import {HexEngine} from '../domain/engine';
import {ServerConnectionFactory} from '../services';
import GameArea from './GameArea';
import {useGameInitializer} from "../hooks/useGameInitializer";

const App = (properties: { engine: HexEngine; connectionFactory: ServerConnectionFactory }) => {
    const {engine, connectionFactory} = properties;

    const [gameId, fetchStatus] = useGameInitializer(engine, connectionFactory);

    if (gameId.value === '')
        return (
            <h1 class="loading">
                {fetchStatus}
                <br/>
                (or broken)
            </h1>
        );

    return <GameArea currentPlayer={engine.currentPlayer} aiMode={engine.getAiMode()}/>;
};

App.displayName = 'App';
export default App;
