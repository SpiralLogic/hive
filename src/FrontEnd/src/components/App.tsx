import {FunctionComponent, h} from 'preact';
import {GameState} from "../domain";
import {useEffect, useState} from "preact/hooks";
import Engine from '../game-engine';
import GameArea from "./GameArea";

const App: FunctionComponent = () => {
    const [gameState, setGameState] = useState<GameState | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const locationParts = window.location.pathname.split('/');
    const loadExistingGame = locationParts[1] === 'game' && locationParts[2]

    const existingGame = (): Promise<GameState> => Engine.getGameRequest(locationParts[2]);

    useEffect(() => {
        const getInitial = loadExistingGame ? existingGame : Engine.newGame;
        getInitial().then(gameState => {
            window.history.replaceState({gameId: gameState.gameId}, document.title, `/game/${gameState.gameId}`);
            setGameState(gameState);
        });
        setLoading(gameState === undefined);
    }, [loading, gameState?.gameId])

    useEffect(() => {
        if (gameState === undefined) return;
        const {closeConnection} = Engine.connectGame(gameState.gameId, setGameState);

        return closeConnection;
    }, [loading])

    if (loading || gameState === undefined) return <h1>loading !</h1>;

    return <GameArea gameState={gameState} moveTile={Engine.moveTile}/>
};

App.displayName = 'App';
export default App;
