import {Cell, GameId, GameState, Player, PlayerId, Tile} from "../domain";
import {FunctionComponent, h} from 'preact';
import {useEffect, useState} from "preact/hooks";
import Engine from '../game-engine';
import GameArea from "./GameArea";

const App: FunctionComponent = () => {
    const [gameState, setGameState] = useState<GameState | undefined>(undefined);
    const [playerId, setPlayerId] = useState<PlayerId>(0);

    const disablePlayerMoves = (playedId: PlayerId, parent: Array<Player | Cell>) =>
        parent
            .flatMap(p => p.tiles)
            .filter(t => t.playerId !== playerId)
            .forEach(t => t.moves.splice(0));

    useEffect(() => {
        const [_, route, gameId, , routePlayerId] = window.location.pathname.split('/');
        const loadExistingGame = route === 'game' && gameId;
        const getInitial = loadExistingGame ? Engine.getGame : Engine.newGame;

        getInitial(gameId).then(gameState => {
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
    }, [gameState === undefined])

    if (gameState === undefined) return <h1>loading !</h1>;
    disablePlayerMoves(playerId, gameState.players);
    disablePlayerMoves(playerId, gameState.cells);

    return <GameArea gameState={gameState} moveTile={Engine.moveTile}/>
};

App.displayName = 'App';
export default App;
