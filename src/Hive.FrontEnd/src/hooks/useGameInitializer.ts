import {useEffect} from "preact/hooks";
import {useSignal, useSignalEffect} from "@preact/signals";
import {addServerHandlers, createOpponentConnectedHandler, createOpponentSelectionHandler} from "../utilities/handlers";
import {HexEngine} from "../domain/engine";
import {HistoricalMove} from "../domain/historical-move";
import {PlayerId} from "../domain";
import {useDispatcher} from "./useHiveDispatchListener";
import {useGameState} from "../services/gameStateContext";
import {ServerConnectionFactory} from "../services";

const isOpponentAi = (history: HistoricalMove[] | undefined, currentPlayer: PlayerId) =>
    history?.length === 0 ||
    history
        ?.filter((h) => h.move.tile.playerId !== currentPlayer)
        .slice(-1)
        .some((h) => h.aiMove);
export const useGameInitializer = (engine: HexEngine, connectionFactory: ServerConnectionFactory) => {
    const dispatcher = useDispatcher();
    const fetchStatus = useSignal('loading !');
    const {gameId, setGameState: updateHandler} = useGameState();
    useEffect(() => {
        engine.initialGame
            .then((initialGameState) => {
                window.history.replaceState(
                    {gameId: initialGameState.gameId},
                    document.title,
                    `/game/${initialGameState.gameId}/${engine.currentPlayer}${document.location.search}`
                );
                if (!isOpponentAi(initialGameState.history, engine.currentPlayer)) {
                    engine.getAiMode().value = 'off';
                }
                updateHandler(initialGameState);
            })
            .catch((error: Error) => (fetchStatus.value = error.message));
    }, [engine.currentPlayer, engine.initialGame]);

    useSignalEffect(() => {
        if (gameId.value === '')
            return () => {
                /* no clean up */
            };
        const serverConnection = connectionFactory({
            currentPlayer: engine.currentPlayer,
            gameId: gameId.value,
            updateHandler,
            opponentSelectionHandler: createOpponentSelectionHandler(dispatcher),
            opponentConnectedHandler: createOpponentConnectedHandler(dispatcher),
        });

        void serverConnection.connectGame();
        const removeServerHandlers = addServerHandlers(
            serverConnection.sendSelection,
            updateHandler,
            engine.move,
            dispatcher
        );

        return () => {
            removeServerHandlers();
            return serverConnection.closeConnection();
        };
    });

    return [gameId, fetchStatus] as const;
}