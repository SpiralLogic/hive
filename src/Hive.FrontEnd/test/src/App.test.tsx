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
    const { dispatcher } = appSetup(Promise.resolve(gameState), gameStateAfterMove);
    await waitFor(() => expect(dispatcher.add).toHaveBeenCalled());
    dispatcher.dispatch({ type: 'move', move: { tileId: 1, coords: { q: 0, r: 0 } } });
    expect(await screen.findByTitle('Hive Game Area')).toBeInTheDocument();
  });

  it('cleans up event handlers', async () => {
    const { unmount, dispatcher } = appSetup();

    await waitFor(() => expect(dispatcher.add).toHaveBeenCalled());
    unmount();
    expect(dispatcher.remove).toHaveBeenCalled();
  });

  it('calls close connection when App is unmounted', async () => {
    mockConsole();
    const { closeConnection, unmount, dispatcher } = appSetup();
    await waitFor(() => expect(dispatcher.add).toHaveBeenCalled());
    unmount();
    await waitFor(() => {
      expect(closeConnection).toHaveBeenCalledWith();
    });
  });
});
