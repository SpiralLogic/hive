import { createGameState } from './fixtures/gameArea.fixtures';
import { h } from 'preact';
import { mockClipboard, mockExecCommand, mockShare, noShare } from './helpers';
import { render, screen } from '@testing-library/preact';
import { simulateEvent } from './helpers';
import GameArea from '../components/GameArea';
import userEvent from '@testing-library/user-event';

describe('gameArea Tests', () => {
  test('default drag over is prevented to allow drop', async () => {
    const gameState = createGameState(1);
    render(
      <GameArea
        aiState={[false, (on) => {}]}
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        playerId={2}
      />
    );
    const preventDefault = simulateEvent(screen.getByTitle('Hive Game Area'), 'dragover');

    expect(preventDefault).toHaveBeenCalledWith();
  });

  test(`removes moves for tiles which aren't the current player`, async () => {
    const gameState = createGameState(1);
    global.window.history.replaceState({}, global.document.title, `/game/33/0`);
    render(
      <GameArea
        aiState={[false, (on) => {}]}
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        playerId={1}
      />
    );

    expect(screen.getByTitle('Player 1').querySelectorAll('[draggable]')).toHaveLength(0);
    expect(screen.getByTitle('Player 2').querySelectorAll('[draggable="true"]')).toHaveLength(1);
  });

  test('show rules is rendered', async () => {
    const gameState = createGameState(1);
    render(
      <GameArea
        aiState={[false, (on) => {}]}
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        playerId={1}
      />
    );

    userEvent.click(screen.getByTitle(/Rules/));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('if available share API is called', () => {
    const restore = mockShare();
    const url = `http://localhost/game/33/1`;
    const gameState = createGameState(1);
    global.window.history.replaceState({}, global.document.title, `/game/33/0`);
    render(
      <GameArea
        aiState={[false, (on) => {}]}
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        playerId={1}
      />
    );
    userEvent.click(screen.getByTitle(/Share/));
    expect(navigator.share).toBeCalledWith(expect.objectContaining({ url }));
    restore();
  });

  test('Click copies opponent link to clipboard with navigator', () => {
    const restore1 = noShare();
    const restore2 = mockClipboard();

    const url = `http://localhost/game/33/1`;
    const gameState = createGameState(1);
    render(
      <GameArea
        aiState={[false, (on) => {}]}
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        playerId={1}
      />
    );
    userEvent.click(screen.getByTitle(/Share/));
    expect(navigator.clipboard.writeText).toBeCalledWith(url);
    restore1();
    restore2();
  });

  test('Click copies opponent link to clipboard with exec command', () => {
    const restore1 = noShare();

    const restore = mockExecCommand();
    const gameState = createGameState(1);
    render(
      <GameArea
        aiState={[false, (on) => {}]}
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        playerId={1}
      />
    );
    userEvent.click(screen.getByTitle(/Share/));
    expect(document.execCommand).toBeCalledWith('copy');
    restore1();
    restore();
  });
});
