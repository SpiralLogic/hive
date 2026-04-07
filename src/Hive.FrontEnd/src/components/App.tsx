import '../css/app.css';

import { useEffect } from 'preact/hooks';
import { HexEngine } from '../domain/engine';
import { ServerConnectionFactory } from '../services';
import GameArea from './GameArea';
import { useGameInitializer } from '../hooks/useGameInitializer';
import { useSignal, useSignalEffect } from '@preact/signals';

const App = (properties: { engine: HexEngine; connectionFactory: ServerConnectionFactory }) => {
  const { engine, connectionFactory } = properties;

  const [gameId, fetchStatus] = useGameInitializer(engine, connectionFactory);
  const aiModeSignal = useSignal(engine.aiMode);
  useEffect(() => {
    engine.onAiMode = (aiMode) => {
      aiModeSignal.value = aiMode;
    };
    return () => {
      engine.onAiMode = undefined;
    };
  }, [engine]);
  useSignalEffect(() => {
    engine.aiMode = aiModeSignal.value;
  });
  if (gameId.value === '')
    return (
      <h1 class="loading">
        {fetchStatus}
        <br />
        (or broken)
      </h1>
    );

  return <GameArea currentPlayer={engine.currentPlayer} aiMode={aiModeSignal} />;
};

App.displayName = 'App';
export default App;
