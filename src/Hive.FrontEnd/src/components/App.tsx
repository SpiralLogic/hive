import '../css/app.css';

import { useContext, useEffect, useState } from 'preact/hooks';

import { GameState, PlayerId } from '../domain';
import { AiMode, HexEngine } from '../domain/engine';
import {
  addServerHandlers,
  createOpponentConnectedHandler,
  createOpponentSelectionHandler,
} from '../utilities/handlers';
import { AiAction, ServerConnectionFactory } from '../services';
import GameArea from './GameArea';
import { Dispatcher } from '../hooks/useHiveDispatchListener';
import { HistoricalMove } from '../domain/historical-move';

const isOpponentAi = (history: HistoricalMove[] | undefined, currentPlayer: PlayerId) =>
  history?.length === 0 ||
  history
    ?.filter((h) => h.move.tile.playerId !== currentPlayer)
    .slice(-1)
    .some((h) => h.aiMove);

const App = (properties: { engine: HexEngine; connectionFactory: ServerConnectionFactory }) => {
  const { engine, connectionFactory } = properties;
  const [gameState, updateHandler] = useState<GameState | undefined>();
  const [aiMode, setAiMode] = useState<AiMode>(engine.getAiMode);
  const [fetchStatus, setFetchStatus] = useState('loading !');
  const dispatcher = useContext(Dispatcher);

  useEffect(() => {
    engine.initialGame
      .then((initialGameState) => {
        window.history.replaceState(
          { gameId: initialGameState.gameId },
          document.title,
          `/game/${initialGameState.gameId}/${engine.currentPlayer}${document.location.search}`
        );
        if (!isOpponentAi(initialGameState.history, engine.currentPlayer)) {
          setAiMode('off');
        }
        updateHandler(initialGameState);
      })
      .catch((error: Error) => setFetchStatus(error.message));
  }, [engine.currentPlayer, engine.initialGame]);

  useEffect(() => {
    const aiToggle = ({ newState }: { newState: AiMode }) => {
      setAiMode(newState);
      return engine.setAiMode(newState);
    };

    return dispatcher.add<AiAction>('toggleAi', aiToggle);
  }, [dispatcher, setAiMode, engine]);

  useEffect(() => {
    if (!gameState?.gameId)
      return () => {
        /* no clean up */
      };
    const serverConnection = connectionFactory({
      currentPlayer: engine.currentPlayer,
      gameId: gameState.gameId,
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
  }, [gameState?.gameId, connectionFactory, engine, dispatcher]);

  if (gameState === undefined)
    return (
      <h1 class="loading">
        {fetchStatus}
        <br />
        (or broken)
      </h1>
    );

  return <GameArea {...gameState} currentPlayer={engine.currentPlayer} aiMode={aiMode} />;
};

App.displayName = 'App';
export default App;
