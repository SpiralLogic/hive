import { h } from 'preact';
import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import GameArea from '../src/components/GameArea';
import { useHiveDispatcher } from '../src/utilities/dispatcher';
import { HiveEvent } from '../src/services';
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

    expect(screen.getByTitle(/player0/)).not.toHaveAttribute('draggable');
    expect(screen.getByTitle(/player1/)).toHaveAttribute('draggable');
  });

  it('show rules is rendered', async () => {
    const gameState = createGameState(1);
    const { rerender } = render(
      <GameArea
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
    );

    userEvent.click(screen.getByTitle(/Rules/));
    rerender(
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
    const clipboard = jest.fn();
    const gameState = createGameState(1);
    const restore = mockClipboard(clipboard);

    const { rerender } = render(
      <GameArea
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={0}
      />
    );

    userEvent.click(screen.getByTitle(/Share/));
    rerender(
      <GameArea
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={0}
      />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    restore();
  });

  it('if available share API is called', () => {
    const share = jest.fn();
    const restore = mockShare(share);
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
    expect(share).toHaveBeenCalledWith(expect.objectContaining({ url }));
    restore();
  });

  it('click copies opponent link to clipboard with navigator', () => {
    const writeText = jest.fn();
    const restore1 = noShare();
    const restore2 = mockClipboard(writeText);

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
    expect(writeText).toHaveBeenCalledWith(url);
    restore1();
    restore2();
  });

  it('click copies opponent link to clipboard with exec command', () => {
    const execCommand = jest.fn();
    const restore1 = noShare();
    const restore = mockExecCommand(execCommand);
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
    expect(execCommand).toHaveBeenCalledWith('copy');
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
    const { rerender } = render(
      <GameArea
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
    );
    useHiveDispatcher().dispatch<HiveEvent>({ type: 'opponentConnected' });
    rerender(
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
    const { rerender } = render(
      <GameArea
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
    );
    useHiveDispatcher().dispatch<HiveEvent>({ type: 'opponentDisconnected' });
    rerender(
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
