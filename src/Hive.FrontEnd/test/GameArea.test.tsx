import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import GameArea from '../src/components/GameArea';
import { GameStatus } from '../src/domain';
import { HiveEvent, TileAction } from '../src/services';
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
import { waitFor } from '@testing-library/dom';

describe('gameArea Tests', () => {
  it('default drag over is prevented to allow drop', () => {
    const gameState = createGameState(1);
    render(
      <GameArea
        gameId={'123A'}
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={2}
      />
    );
    const preventDefault = simulateEvent(screen.getByTitle('Hive Game Area'), 'dragover');

    expect(preventDefault).toHaveBeenCalledWith();
  });

  it(`resets all selected tiles which aren't the current player`, async () => {
    const gameState = createGameState(1);
    global.window.history.replaceState({}, global.document.title, `/game/33/0`);
    render(
      <GameArea
        gameId={'123A'}
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
    );
    await waitFor(() =>
      getHiveDispatcher().dispatch<TileAction>({ type: 'tileSelect', tile: gameState.players[1].tiles[0] })
    );

    expect(screen.getByTitle(/creature1/)).toHaveClass('selected');
  });

  it(`removes all moves for tiles which aren't the current player`, () => {
    const gameState = createGameState(1);
    global.window.history.replaceState({}, global.document.title, `/game/33/0`);
    render(
      <GameArea
        gameId={'123A'}
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
    );

    expect(screen.getByTitle(/creature0/)).not.toHaveAttribute('draggable');
    expect(screen.getByTitle(/creature1/)).toHaveAttribute('draggable');
  });

  it('show rules is rendered', async () => {
    const gameState = createGameState(1);
    render(
      <GameArea
        gameId={'123A'}
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
        gameId={'123A'}
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
        gameId={'123A'}
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
        gameId={'123A'}
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
    const gameState = createGameState(1);
    global.window.history.replaceState({}, global.document.title, `/game/33/1`);
    render(
      <GameArea
        gameId={'33'}
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
    );

    userEvent.click(screen.getByTitle(/Share/));
    expect(share).toHaveBeenCalledWith(expect.objectContaining({ url: `//game/33/0` }));
    restore();
  });

  it('click copies opponent link to clipboard with navigator', () => {
    const writeText = jest.fn();
    const restore1 = noShare();
    const restore2 = mockClipboard(writeText);

    const gameState = createGameState(1);
    render(
      <GameArea
        gameId={'33'}
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
      />
    );
    userEvent.click(screen.getByTitle(/Share/));
    expect(writeText).toHaveBeenCalledWith(`//game/33/0`);
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
        gameId={'33'}
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

  it(`can't copy link`, () => {
    const restore = noShare();
    const gameState = createGameState(1);
    render(
      <GameArea
        gameId={'123A'}
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
        gameId={'123A'}
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
        gameId={'123A'}
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
        gameId={'123A'}
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
        gameId={'123A'}
        gameStatus={'NewGame'}
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={0}
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  const gameStatusShownDialogs: Array<[GameStatus, number, boolean]> = [
    ['AiWin', 0, true],
    ['Player0Win', 0, true],
    ['Player0Win', 1, true],
    ['Player1Win', 0, true],
    ['Player1Win', 1, true],
    ['GameOver', 0, true],
    ['Draw', 0, true],
  ];
  const gameStatusNotShownDialogs: Array<[GameStatus, boolean]> = [
    ['NewGame', false],
    ['MoveSuccess', false],
    ['MoveSuccessNextPlayerSkipped', false],
    ['MoveInvalid', false],
  ];

  it.each(gameStatusShownDialogs)(
    `Game status %s shows dialog for player 1 with current player %i`,
    (gameStatus, currentPlayer) => {
      const gameState = createGameState(1);
      render(
        <GameArea
          gameId={'123A'}
          gameStatus={gameStatus}
          players={gameState.players}
          cells={gameState.cells}
          currentPlayer={currentPlayer}
        />
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    }
  );

  it.each(gameStatusNotShownDialogs)(`Game status %s doesn't show dialog for player 1`, (gameStatus) => {
    const gameState = createGameState(1);
    render(
      <GameArea
        gameId={'123A'}
        gameStatus={gameStatus}
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={0}
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it.each(gameStatusShownDialogs)(`Game status %s shows dialog for player 2`, (gameStatus) => {
    const gameState = createGameState(1);
    render(
      <GameArea
        gameId={'123A'}
        gameStatus={gameStatus}
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={0}
      />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it.each(gameStatusNotShownDialogs)(`Game status %s doesn't show dialog for player 2`, (gameStatus) => {
    const gameState = createGameState(1);
    render(
      <GameArea
        gameId={'123A'}
        gameStatus={gameStatus}
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={0}
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it(`Game over modal close`, async () => {
    const gameState = createGameState(1);

    render(
      <GameArea
        gameId={'123A'}
        gameStatus={'GameOver'}
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={0}
      />
    );
    userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(await screen.findByRole('dialog')).not.toBeInTheDocument();
  });

  it(`Game over modal new game`, () => {
    const assign = jest.fn();
    const restoreLocation = mockLocation({ assign });
    const gameState = createGameState(1);

    render(
      <GameArea
        gameId={'123A'}
        gameStatus={'GameOver'}
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={0}
      />
    );
    userEvent.click(screen.getByRole('button', { name: /new game/i }));
    expect(assign).toHaveBeenCalledWith('/');

    restoreLocation();
  });
});
