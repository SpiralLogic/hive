import { h } from 'preact';
import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import GameArea from '../components/GameArea';
import { useHiveDispatcher } from '../utilities/dispatcher';
import { HiveEvent } from '../services';
import { mockClipboard, mockExecCommand, mockShare, noShare, simulateEvent } from './test-helpers';
import { createGameState } from './fixtures/gameArea.fixtures';

describe('gameArea Tests', () => {
  it('default drag over is prevented to allow drop', async () => {
    const gameState = createGameState(1);
    render(
      <GameArea
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={2}
      />
    );
    const preventDefault = simulateEvent(screen.getByTitle('Hive Game Area'), 'dragover');

    expect(preventDefault).toHaveBeenCalledWith();
  });

  it(`removes moves for tiles which aren't the current player`, async () => {
    const gameState = createGameState(1);
    global.window.history.replaceState({}, global.document.title, `/game/33/0`);
    render(
      <GameArea
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
    );

    expect(screen.getByTitle('Player 1').querySelectorAll('[draggable]')).toHaveLength(0);
    expect(screen.getByTitle('Player 2').querySelectorAll('[draggable="true"]')).toHaveLength(1);
  });

  it('show rules is rendered', async () => {
    const gameState = createGameState(1);
    const gameArea = render(
      <GameArea
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
    );

    userEvent.click(screen.getByTitle(/Rules/));
    gameArea.rerender(
      <GameArea
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('show share is rendered', async () => {
    const gameState = createGameState(1);
    const restore = mockClipboard();

    const gameArea = render(
      <GameArea
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
    );

    userEvent.click(screen.getByTitle(/Share/));
    gameArea.rerender(
      <GameArea
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    restore();
  });

  it('if available share API is called', () => {
    const restore = mockShare();
    const url = `http://localhost/game/33/0`;
    const gameState = createGameState(1);
    global.window.history.replaceState({}, global.document.title, `/game/33/1`);
    render(
      <GameArea
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
    );
    userEvent.click(screen.getByTitle(/Share/));
    expect(navigator.share).toHaveBeenCalledWith(expect.objectContaining({ url }));
    restore();
  });

  it('click copies opponent link to clipboard with navigator', () => {
    const restore1 = noShare();
    const restore2 = mockClipboard();

    const url = `http://localhost/game/33/0`;
    const gameState = createGameState(1);
    render(
      <GameArea
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
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
      <GameArea
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
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
      <GameArea
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
    );
    userEvent.click(screen.getByTitle(/Share/));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    restore();
  });

  it(`player connected`, async () => {
    const gameState = createGameState(1);
    const gameArea = render(
      <GameArea
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
    );
    useHiveDispatcher().dispatch<HiveEvent>({ type: 'opponentConnected' });
    gameArea.rerender(
      <GameArea
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it(`player disconnected`, async () => {
    const gameState = createGameState(1);
    const gameArea = render(
      <GameArea
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
    );
    useHiveDispatcher().dispatch<HiveEvent>({ type: 'opponentDisconnected' });
    gameArea.rerender(
      <GameArea
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it(`player1 wins`, async () => {
    const gameState = createGameState(1);
    render(
      <GameArea
        gameStatus="Player1Win"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it(`player0 wins`, async () => {
    const gameState = createGameState(1);
    render(
      <GameArea
        gameStatus="Player0Win"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={0}
      />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
