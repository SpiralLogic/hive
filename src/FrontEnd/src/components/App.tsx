import {FunctionComponent, h} from 'preact';
import {GameId, GameState, PlayerId} from "../domain";
import {useEffect, useState} from "preact/hooks";
import Engine from '../game-engine';
import GameArea from "./GameArea";

const App: FunctionComponent = () => {
    const [loading, setLoading] = useState(true);
    const [gameState, setGameState] = useState<GameState | undefined>(undefined);
    const [playerId, setPlayerId] = useState<PlayerId>(0);

    const existingGame = (gameId: GameId): Promise<GameState> => Engine.getGame(gameId);

    useEffect(() => {
        const [_, route, gameId, routePlayerId] = window.location.pathname.split('/');
        const loadExistingGame = route === 'game' && gameId;
        const getInitial = loadExistingGame ? existingGame : Engine.newGame;

        getInitial(gameId).then(gameState => {
            setLoading(gameState === undefined);
            const {gameId} = gameState;
            setGameState(gameState);
            const [player] = gameState.players
            const playerId = Number(routePlayerId) as PlayerId ? Number(routePlayerId) : player.id;
            setPlayerId(playerId);
            window.history.replaceState({playerId, gameId}, document.title, `/game/${gameId}/${playerId}`);
        });
    }, [])

    useEffect(() => {
        if (gameState === undefined) return;
        const {closeConnection} = Engine.connectGame(gameState.gameId, setGameState);

        return closeConnection;
    }, [loading])

    if (loading || gameState === undefined) return <h1>loading !</h1>;
    gameState.players.flatMap(p=>p.tiles).filter(t=>t.playerId!==playerId).forEach(t=>t.moves.splice(0));
    gameState.cells.flatMap(p=>p.tiles).filter(t=>t.playerId!==playerId).forEach(t=>t.moves.splice(0));

    return <GameArea gameState={gameState} moveTile={Engine.moveTile}/>
};

App.displayName = 'App';
export default App;
