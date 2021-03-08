import { GameState } from '../domain';
import { createGameState } from './fixtures/gameArea.fixtures';
import { h } from 'preact';
import { render, screen } from '@testing-library/preact';
import { simulateEvent } from './helpers';
import GameArea from '../components/GameArea';

describe('GameArea Tests', () => {
  let gameState: GameState;
  beforeEach(() => {
    gameState = createGameState(1);
  });

  test('default drag over is prevented to allow drop', async () => {
    render(<GameArea players={gameState.players} cells={gameState.cells} playerId={2} />);
    const preventDefault = simulateEvent(screen.getByTitle('Hive Game Area'), 'dragover');

    expect(preventDefault).toHaveBeenCalled();
  });

  test(`removes moves for tiles which aren't the current player`, async () => {
    global.window.history.replaceState({}, global.document.title, `/game/33/0`);
    render(<GameArea players={gameState.players} cells={gameState.cells} playerId={2} />);

    expect(screen.getByTitle('Player 1').querySelectorAll('[draggable]')).toHaveLength(0);
    expect(screen.getByTitle('Player 2').querySelectorAll('[draggable]')).toHaveLength(1);
  });
});
