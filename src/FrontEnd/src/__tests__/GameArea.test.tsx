import { GameState } from '../domain';
import { h } from 'preact';
import { render } from '@testing-library/preact';
import { simulateEvent } from './helpers';
import Engine from '../game-engine';
import GameArea from '../components/GameArea';

jest.mock('../game-engine');
describe('GameArea Tests', () => {
  let gameState: GameState;
  beforeEach(() => {
    const emptyCell = { coords: { q: 0, r: 0 }, tiles: [] };
    const player = { id: 2, name: 'Player 2', tiles: [] };
    gameState = { gameId: '33', cells: [emptyCell], players: [player] };
    const gameAfterMove = {
      cells: [emptyCell, emptyCell],
      players: [player, player],
    };
    Engine.newGame = jest.fn().mockResolvedValue(gameState);
    Engine.moveTile = jest.fn().mockResolvedValue(gameAfterMove);
  });

  test('default on drop is prevented', async () => {
    const gameArea = render(<GameArea {...gameState} />);
    await Engine.newGame();
    gameArea.rerender(<GameArea {...gameState} />);

    const preventDefault = simulateEvent(gameArea.container.firstElementChild as HTMLElement, 'dragover');
    expect(preventDefault).toHaveBeenCalled();
  });
});
