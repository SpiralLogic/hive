import { render, screen } from '@testing-library/preact';
import Players from '../../src/components/Players';

const ant = { id: 1, playerId: 1, creature: 'ant', moves: [{ q: 1, r: 1 }] };
const fly = { id: 2, playerId: 0, creature: 'fly', moves: [] };

const defaultProps = {
  currentPlayer: 0,
  players: [
    { id: 1, name: 'Player 1', tiles: [ant, fly, fly] },
    { id: 2, name: 'Player 2', tiles: [ant] },
  ],
};
describe('<Players>', () => {
  it('players are rendered', () => {
    render(<Players {...defaultProps} />);
    expect(screen.getAllByRole('heading', { name: /Player \d+/ })).toHaveLength(2);
  });

  it('renders', () => {
    global.window.history.replaceState({}, global.document.title, `/game/33/1`);
    const view = render(<Players {...defaultProps} />);
    expect(view.baseElement).toMatchSnapshot();
  });
});
