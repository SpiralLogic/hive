import { screen } from '@testing-library/preact';
import { createGameState } from '../fixtures/app.fixture';
import { waitFor } from '@testing-library/dom';
import { type Creature } from '@hive/domain';
import { mockConsole } from '../helpers/console';
import { appSetup } from './utilities/App.setup.tsx';

describe.sequential('<App>', () => {
  it('loads initial board', async () => {
    const gameState = createGameState(4);
    const gameStateAfterMove = {
      ...gameState,
      history: [
        ...gameState.history,
        {
          move: {
            tile: {
              id: 4,
              playerId: 0,
            },
            coords: {
              q: -1,
              r: -4,
            },
          },
          aiMove: false,
        },
      ],
      players: [
        {
          ...gameState.players[0],
          tiles: [
            {
              id: 4,
              playerId: 0,
              creature: 'rabbit' as Creature,
              moves: [],
            },
          ],
        },
        gameState.players[1],
      ],
    };
    const { dispatcher, engine } = appSetup(Promise.resolve(gameState), gameStateAfterMove);
    await engine.initialGame;
    dispatcher.dispatch({ type: 'move', move: { tileId: 1, coords: { q: 0, r: 0 } } });
    expect(await screen.findByTitle('Hive Game Area')).toBeInTheDocument();
  });

  it('cleans up event handlers', async () => {
    const { engine, unmount, dispatcher } = appSetup();
    vi.spyOn(dispatcher, 'remove');

    await engine.initialGame;
    unmount();
    await waitFor(() => expect(dispatcher.remove).toBeCalled());
  });

  it('calls close connection when App is unmounted', async () => {
    mockConsole();
    const { engine, closeConnection, unmount } = appSetup();
    await engine.initialGame;
    unmount();
    expect(closeConnection).toHaveBeenCalledWith();
  });
});
