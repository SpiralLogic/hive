import { render, screen } from '@testing-library/preact';
import { AiMode, HexEngine, HexServerConnectionFactory } from '../../src/domain/engine';
import App from '../../src/components/App';
import { createGameState } from '../fixtures/app.fixture';
import { Dispatcher } from '../../src/utilities/dispatcher';
import { HiveDispatcher } from '../../src/services';

const closeConnectionMock = jest.fn().mockImplementation(() => Promise.resolve());
const defaultConnectionFactory: HexServerConnectionFactory = () => ({
  connectGame: jest.fn(),
  getConnectionState: jest.fn(),
  closeConnection: closeConnectionMock,
  sendSelection: () => Promise.resolve(),
});

describe('<App>', () => {
  const gameState = createGameState(4);
  const gameAfterMove = createGameState(5);
  const engine: HexEngine = {
    setAiMode: jest.fn(),
    getAiMode: jest.fn(),
    initialGame: Promise.resolve(gameState),
    currentPlayer: 0,
    move: jest.fn().mockResolvedValue(gameAfterMove),
  };

  it('shows loading', () => {
    render(<App engine={engine} connectionFactory={defaultConnectionFactory} />);
    expect(screen.getByText(/loading/)).toBeInTheDocument();
  });

  it.each<AiMode>(['on', 'off'])('turns %s Ai move', (state) => {
    const dispatcher = new HiveDispatcher();
    render(
      <Dispatcher.Provider value={dispatcher}>
        <App engine={engine} connectionFactory={defaultConnectionFactory} />
      </Dispatcher.Provider>
    );

    dispatcher.dispatch({ type: 'toggleAi', newState: state });
    expect(engine.setAiMode).toBeCalledWith(state);
  });

  it('shows game when loaded', async () => {
    render(<App engine={engine} connectionFactory={defaultConnectionFactory} />);
    await engine.initialGame;
    expect(await screen.findByTitle('Hive Game Area')).toBeInTheDocument();
  });

  it('cleanup', async () => {
    const dispatcher = new HiveDispatcher();
    jest.spyOn(dispatcher, 'remove');
    const { rerender } = render(
      <Dispatcher.Provider value={dispatcher}>
        <App engine={engine} connectionFactory={defaultConnectionFactory} />
      </Dispatcher.Provider>
    );
    await engine.initialGame;
    rerender(
      <Dispatcher.Provider value={dispatcher}>
        <App engine={engine} connectionFactory={defaultConnectionFactory} />
      </Dispatcher.Provider>
    );
    expect(dispatcher.remove).toBeCalled();
  });
});
