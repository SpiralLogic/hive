import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import GameArea from '../src/components/GameArea';
import { GameStatus } from '../src/domain';
import { HiveEvent } from '../src/services';
import { getHiveDispatcher } from '../src/utilities/dispatcher';
import { createGameState } from './fixtures/game-area.fixtures';
import {
  mockClipboard,
  mockExecCommand,
  mockLocation,
  mockShare,
  noShare,
  simulateEvent,
} from './test-helpers';

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
    render(
      <GameArea
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
    );

    userEvent.click(screen.getByTitle(/Rules/));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it(`share rules close`, async () => {
    const gameState = createGameState(1);
    render(
      <GameArea
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
    );

    userEvent.click(screen.getByTitle(/Rules/));
    userEvent.click(await screen.findByRole('button', { name: /close/i }));
    expect(await screen.findByRole('dialog')).not.toBeInTheDocument();
  });

  it('share modal is rendered', async () => {
    const clipboard = jest.fn();
    const gameState = createGameState(1);
    const restore = mockClipboard(clipboard);

    render(
      <GameArea
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={0}
      />
    );

    userEvent.click(screen.getByTitle(/Share/));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    restore();
  });

  it(`share modal close`, async () => {
    const clipboard = jest.fn();
    const gameState = createGameState(1);
    const restore = mockClipboard(clipboard);

    render(
      <GameArea
        gameStatus={'MoveSuccess'}
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={0}
      />
    );
    userEvent.click(screen.getByTitle(/Share/));
    userEvent.click(await screen.findByRole('button', { name: /close/i }));
    expect(await screen.findByRole('dialog')).not.toBeInTheDocument();
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

  it('click copies opponent link to clipboard with exec command', async () => {
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
    render(
      <GameArea
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
    );
    getHiveDispatcher().dispatch<HiveEvent>({ type: 'opponentConnected' });
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it(`player disconnected`, async () => {
    const gameState = createGameState(1);
    render(
      <GameArea
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
    );
    getHiveDispatcher().dispatch<HiveEvent>({ type: 'opponentDisconnected' });

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it(`player connected modal close`, async () => {
    const gameState = createGameState(1);

    const { rerender } = render(
      <GameArea
        gameStatus={'MoveSuccess'}
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={0}
      />
    );
    getHiveDispatcher().dispatch<HiveEvent>({ type: 'opponentDisconnected' });

    userEvent.click(await screen.findByRole('button', { name: /close/i }));
    rerender(
      <GameArea
        gameStatus={'NewGame'}
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={0}
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  const gameStatusShownDialogs: Array<[GameStatus, boolean]> = [
    ['AiWin', true],
    ['Player0Win', true],
    ['Player1Win', true],
    ['GameOver', true],
    ['Draw', true],
  ];
  const gameStatusNotShownDialogs: Array<[GameStatus, boolean]> = [
    ['NewGame', false],
    ['MoveSuccess', false],
    ['MoveSuccessNextPlayerSkipped', false],
    ['MoveInvalid', false],
  ];

  it.each(gameStatusShownDialogs)(`Game status %s shows dialog for player 1`, async (gameStatus) => {
    const gameState = createGameState(1);
    render(
      <GameArea
        gameStatus={gameStatus}
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={0}
      />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
  it.each(gameStatusNotShownDialogs)(
    `Game status %s doesn't show dialog for player 1`,
    async (gameStatus) => {
      const gameState = createGameState(1);
      render(
        <GameArea
          gameStatus={gameStatus}
          players={gameState.players}
          cells={gameState.cells}
          currentPlayer={0}
        />
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    }
  );

  it.each(gameStatusShownDialogs)(`Game status %s shows dialog for player 2`, async (gameStatus) => {
    const gameState = createGameState(1);
    render(
      <GameArea
        gameStatus={gameStatus}
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={0}
      />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it.each(gameStatusNotShownDialogs)(
    `Game status %s doesn't show dialog for player 2`,
    async (gameStatus) => {
      const gameState = createGameState(1);
      render(
        <GameArea
          gameStatus={gameStatus}
          players={gameState.players}
          cells={gameState.cells}
          currentPlayer={0}
        />
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    }
  );

  it(`Game over modal close`, async () => {
    const restoreLocation = mockLocation({ assign: jest.fn() });
    const gameState = createGameState(1);

    const { rerender } = render(
      <GameArea
        gameStatus={'GameOver'}
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={0}
      />
    );
    userEvent.click(screen.getByRole('button', { name: /close/i }));
    rerender(
      <GameArea
        gameStatus={'GameOver'}
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={0}
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(window.location.assign).toHaveBeenCalledWith('/');

    restoreLocation();
  });
});
