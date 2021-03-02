import { GameState } from '../domain';
import { h } from 'preact';
import { render } from '@testing-library/preact';
import { simulateEvent } from './helpers';
import App from '../components/App';
import Engine from '../utilities/game-engine';
import GameArea from '../components/GameArea';
import PlayerList from '../components/PlayerList';
jest.mock('../components/PlayerList');

jest.mock('../utilities/game-engine');
describe('GameArea Tests', () => {
  let gameState: GameState;
  beforeEach(() => {
    const emptyCell = { coords: { q: 0, r: 0 }, tiles: [] };
    const player = { id: 2, name: 'Player 2', tiles: [] };
    const player2 = {
      id: 1,
      name: 'Player 2',
      tiles: [{ id: 1, playerId: 1, creature: 'ant', moves: [{ q: 0, r: 0 }] }],
    };
    gameState = { gameId: '33', cells: [emptyCell], players: [player, player2] };
    const gameAfterMove = {
      cells: [emptyCell, emptyCell],
      players: [player, player],
    };
    Engine.getNewGame = jest.fn().mockResolvedValue(gameState);
    Engine.moveTile = jest.fn().mockResolvedValue(gameAfterMove);
  });

  test('default on drop is prevented', async () => {
    const gameArea = render(<GameArea players={gameState.players} cells={gameState.cells} playerId={2} />);
    await Engine.getNewGame();
    gameArea.rerender(<GameArea players={gameState.players} cells={gameState.cells} playerId={2} />);

    const preventDefault = simulateEvent(gameArea.container.firstElementChild as HTMLElement, 'dragover');
    expect(preventDefault).toHaveBeenCalled();
  });

  test(`removes moves for tiles which aren't the current player`, async () => {
    global.window.history.replaceState({}, global.document.title, `/game/33/0`);
    render(<GameArea players={gameState.players} cells={gameState.cells} playerId={2} />);
    expect(PlayerList).toHaveBeenLastCalledWith(expect.objectContaining({ players: gameState.players }), {});
  });
});
