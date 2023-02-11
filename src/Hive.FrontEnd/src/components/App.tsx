import '../css/app.css';

import { useContext, useEffect } from 'preact/hooks';

import { PlayerId } from '../domain';
import { HexEngine } from '../domain/engine';
import {
  addServerHandlers,
  createOpponentConnectedHandler,
  createOpponentSelectionHandler,
} from '../utilities/handlers';
import { ServerConnectionFactory } from '../services';
import GameArea from './GameArea';
import { Dispatcher } from '../hooks/useHiveDispatchListener';
import { HistoricalMove } from '../domain/historical-move';
import { useGameState } from '../services/signals';
import { useSignal, useSignalEffect } from '@preact/signals';

const isOpponentAi = (history: HistoricalMove[] | undefined, currentPlayer: PlayerId) =>
  history?.length === 0 ||
  history
    ?.filter((h) => h.move.tile.playerId !== currentPlayer)
    .slice(-1)
    .some((h) => h.aiMove);
const App = (properties: { engine: HexEngine; connectionFactory: ServerConnectionFactory }) => {
  const { engine, connectionFactory } = properties;

  const { gameId, setGameState: updateHandler } = useGameState();

  const fetchStatus = useSignal('loading !');
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

  if (gameId.value === '')
    return (
      <h1 class="loading">
        {fetchStatus}
        <br />
        (or broken)
      </h1>
    );

  return (
    <>
      <GameArea currentPlayer={engine.currentPlayer} aiMode={engine.getAiMode()} />
    </>
  );
};

App.displayName = 'App';
export default App;
