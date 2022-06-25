import '../css/app.css';

import { FunctionComponent } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';

import { GameState } from '../domain';
import { HexEngine, HexServerConnectionFactory } from '../domain/engine';
import {
  addServerHandlers,
  createOpponentConnectedHandler,
  createOpponentSelectionHandler,
} from '../utilities/handlers';
import { Dispatcher } from '../utilities/dispatcher';
import GameArea from './GameArea';

const App: FunctionComponent<{ engine: HexEngine; connectionFactory: HexServerConnectionFactory }> = (
  properties
) => {
  const { engine, connectionFactory } = properties;
  const [gameState, updateHandler] = useState<GameState | undefined>();
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
        updateHandler(initialGameState);
      })
      .catch((error: Error) => setFetchStatus(error.message));
  }, [engine.currentPlayer, engine.initialGame]);

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
      engine,
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

  return (
    <Dispatcher.Provider value={dispatcher}>
      <GameArea {...gameState} currentPlayer={engine.currentPlayer} />
    </Dispatcher.Provider>
  );
};

App.displayName = 'App';
export default App;
