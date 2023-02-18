import { render, screen } from '@testing-library/preact';
import Players from '../../src/components/Players';
import { GameStateContext } from '../../src/services/signals';
import { signalize } from '../helpers/signalize';

const ant = { id: 1, playerId: 1, creature: 'ant', moves: [{ q: 1, r: 1 }] };
const fly = { id: 2, playerId: 0, creature: 'fly', moves: [] };

const defaultProps = {
  currentPlayer: 0,
};
const setup = () =>
  render(
    <GameStateContext.Provider
      value={{
        ...signalize({
          history: [],
          gameId: '33',
          cells: [],
          gameStatus: 'NewGame',
          players: [
            { id: 1, name: 'Player 1', tiles: [ant, fly, fly] },
            { id: 2, name: 'Player 2', tiles: [ant] },
          ],
        }),
        setGameState: vi.fn(),
      }}>
      <Players {...defaultProps} />
    </GameStateContext.Provider>
  );
describe('<Players>', () => {
  it('players are rendered', () => {
    setup();
    expect(screen.getAllByRole('heading', { name: /Player \d+/ })).toHaveLength(2);
  });

  it('renders', () => {
    global.window.history.replaceState({}, global.document.title, `/game/33/1`);
    const view = setup();
    expect(view.baseElement).toMatchSnapshot();
  });
});
