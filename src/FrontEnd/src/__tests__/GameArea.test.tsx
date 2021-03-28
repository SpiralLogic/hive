import { h } from 'preact';
import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import GameArea from '../components/GameArea';
import { mockClipboard, mockExecCommand, mockShare, noShare, simulateEvent } from './test-helpers';

import { createGameState } from './fixtures/gameArea.fixtures';

describe('gameArea Tests', () => {
  it('default drag over is prevented to allow drop', async () => {
    const gameState = createGameState(1);
    render(
      <GameArea gameStatus="MoveSuccess" players={gameState.players} cells={gameState.cells} playerId={2} />
    );
    const preventDefault = simulateEvent(screen.getByTitle('Hive Game Area'), 'dragover');

    expect(preventDefault).toHaveBeenCalledWith();
  });

  it(`removes moves for tiles which aren't the current player`, async () => {
    const gameState = createGameState(1);
    global.window.history.replaceState({}, global.document.title, `/game/33/0`);
    render(
      <GameArea gameStatus="MoveSuccess" players={gameState.players} cells={gameState.cells} playerId={1} />
    );

    expect(screen.getByTitle('Player 1').querySelectorAll('[draggable]')).toHaveLength(0);
    expect(screen.getByTitle('Player 2').querySelectorAll('[draggable="true"]')).toHaveLength(1);
  });

  it('show rules is rendered', async () => {
    const gameState = createGameState(1);
    render(
      <GameArea gameStatus="MoveSuccess" players={gameState.players} cells={gameState.cells} playerId={1} />
    );

    userEvent.click(screen.getByTitle(/Rules/));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('if available share API is called', () => {
    const restore = mockShare();
    const url = `http://localhost/game/33/1`;
    const gameState = createGameState(1);
    global.window.history.replaceState({}, global.document.title, `/game/33/0`);
    render(
      <GameArea gameStatus="MoveSuccess" players={gameState.players} cells={gameState.cells} playerId={1} />
    );
    userEvent.click(screen.getByTitle(/Share/));
    expect(navigator.share).toHaveBeenCalledWith(expect.objectContaining({ url }));
    restore();
  });

  it('click copies opponent link to clipboard with navigator', () => {
    const restore1 = noShare();
    const restore2 = mockClipboard();

    const url = `http://localhost/game/33/1`;
    const gameState = createGameState(1);
    render(
      <GameArea gameStatus="MoveSuccess" players={gameState.players} cells={gameState.cells} playerId={1} />
    );
    userEvent.click(screen.getByTitle(/Share/));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(url);
    restore1();
    restore2();
  });

  it('click copies opponent link to clipboard with exec command', () => {
    const restore1 = noShare();
    const restore = mockExecCommand();
    const gameState = createGameState(1);
    render(
      <GameArea gameStatus="MoveSuccess" players={gameState.players} cells={gameState.cells} playerId={1} />
    );
    userEvent.click(screen.getByTitle(/Share/));
    expect(document.execCommand).toHaveBeenCalledWith('copy');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    restore1();
    restore();
  });

  it(`can't copy link`, async () => {
    const restore = noShare();
    const gameState = createGameState(1);
    render(
      <GameArea gameStatus="MoveSuccess" players={gameState.players} cells={gameState.cells} playerId={1} />
    );
    userEvent.click(screen.getByTitle(/Share/));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    restore();
  });
});
