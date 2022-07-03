import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { Dispatcher } from '../../src/utilities/dispatcher';

import GameArea from '../../src/components/GameArea';
import { GameStatus } from '../../src/domain';
import { ConnectEvent, HiveDispatcher, HiveEvent, TileAction } from '../../src/services';
import { createGameState } from '../fixtures/game-area.fixtures';
import { mockClipboard, mockExecCommand, mockLocation, mockShare, noShare, simulateEvent } from '../helpers';

describe('<GameArea>', () => {
  test('default drag over is prevented to allow drop', () => {
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
    const dispatcher = new HiveDispatcher();
    render(
      <Dispatcher.Provider value={dispatcher}>
        <GameArea
          gameId={'123A'}
          gameStatus="MoveSuccess"
          players={gameState.players}
          cells={gameState.cells}
          currentPlayer={1}
        />
      </Dispatcher.Provider>
    );
    dispatcher.dispatch<TileAction>({ type: 'tileSelect', tile: gameState.players[1].tiles[0] });
    expect(await screen.findByTitle(/creature1/)).toHaveClass('selected');
  });

  it(`removes all moves for tiles which aren't the current player`, async () => {
    const gameState = createGameState(1);
    global.window.history.replaceState({}, global.document.title, `/game/33/0`);
    const dispatcher = new HiveDispatcher();
    render(
      <Dispatcher.Provider value={dispatcher}>
        <GameArea
          gameId={'123A'}
          gameStatus="MoveSuccess"
          players={gameState.players}
          cells={gameState.cells}
          currentPlayer={1}
        />
      </Dispatcher.Provider>
    );

    expect(screen.getByTitle(/creature0/)).not.toHaveAttribute('draggable');
    expect(screen.getByTitle(/creature1/)).toHaveAttribute('draggable');
  });

  it('opens show rules', async () => {
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

    await userEvent.click(screen.getByTitle(/Rules/));

    expect(await screen.findByRole('dialog', { name: /game rules/i })).toBeInTheDocument();
  });

  it(`closes show rules`, async () => {
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

    await userEvent.click(screen.getByTitle(/rules/i));
    await userEvent.click(await screen.findByRole(/button/i, { hidden: false, name: /close dialog/i }));
    expect(screen.queryByRole('dialog', { name: /game rules/i })).not.toBeInTheDocument();
  });

  it('opens share modal', async () => {
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

    await userEvent.click(screen.getByTitle(/Share/));

    expect(await screen.findByRole('dialog', { name: /linked shared/i })).toBeInTheDocument();
    restore();
  });

  it(`closes share modal`, async () => {
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
    await userEvent.click(screen.getByTitle(/Share/));
    await userEvent.click(await screen.findByRole(/button/i, { hidden: false, name: /close dialog/i }));
    expect(screen.queryByRole('dialog', { name: /linked shared/i, hidden: false })).not.toBeInTheDocument();
    restore();
  });

  it('calls share API', async () => {
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

    await userEvent.click(screen.getByTitle(/Share/));
    expect(share).toHaveBeenCalledWith(expect.objectContaining({ url: `http://localhost/game/33/0` }));
    restore();
  });

  it('copies opponent link to clipboard with navigator', async () => {
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
    await userEvent.click(screen.getByTitle(/Share/));
    expect(writeText).toHaveBeenCalledWith(`http://localhost/game/33/0`);
    restore1();
    restore2();
  });

  it('copies opponent link to clipboard with exec command', async () => {
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
    await userEvent.click(screen.getByTitle(/Share/));
    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    restore1();
    restore();
  });

  it(`closes modal when share link can't be copied`, async () => {
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
    await userEvent.click(screen.getByTitle(/Share/));
    expect(screen.queryByRole('dialog', { name: /linked shared/i })).not.toBeInTheDocument();
    restore();
  });

  it.each<[ConnectEvent['type'], RegExp]>([
    ['opponentConnected', /connected/i],
    ['opponentDisconnected', /disconnected/i],
  ])(`opens modal when player %s`, async (connectionState, expected) => {
    const gameState = createGameState(1);
    const dispatcher = new HiveDispatcher();
    render(
      <Dispatcher.Provider value={dispatcher}>
        <GameArea
          gameId={'123A'}
          gameStatus="MoveSuccess"
          players={gameState.players}
          cells={gameState.cells}
          currentPlayer={1}
        />
      </Dispatcher.Provider>
    );
    dispatcher.dispatch<HiveEvent>({ type: connectionState });

    expect(await screen.findByText(expected)).toBeInTheDocument();
  });

  it.each<[ConnectEvent['type'], RegExp]>([
    ['opponentConnected', /player connected/i],
    ['opponentDisconnected', /player disconnected/i],
  ])(`closes the modal when player %s`, async (connectionState, expected) => {
    const gameState = createGameState(1);
    const dispatcher = new HiveDispatcher();

    render(
      <Dispatcher.Provider value={dispatcher}>
        <GameArea
          gameId={'123A'}
          gameStatus={'MoveSuccess'}
          players={gameState.players}
          cells={gameState.cells}
          currentPlayer={0}
        />
      </Dispatcher.Provider>
    );
    dispatcher.dispatch<HiveEvent>({ type: connectionState });

    await userEvent.click(await screen.findByRole(/button/i, { hidden: false, name: /close dialog/i }));

    expect(screen.queryByRole('dialog', { name: expected })).not.toBeInTheDocument();
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
    async (gameStatus, currentPlayer) => {
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
      expect(await screen.findByRole('dialog', { name: /game over/i })).toBeInTheDocument();
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
    expect(screen.queryByRole('dialog', { name: /game over/i })).not.toBeInTheDocument();
  });

  it.each(gameStatusShownDialogs)(`Game status %s shows dialog for player 2`, async (gameStatus) => {
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
    expect(await screen.findByRole('dialog', { name: /game over/i })).toBeInTheDocument();
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
    expect(screen.queryByRole('dialog', { name: /game over/i })).not.toBeInTheDocument();
  });

  it(`closes game over modal`, async () => {
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
    await userEvent.click(await screen.findByRole(/button/i, { hidden: false, name: /close dialog/i }));
    expect(screen.queryByRole('dialog', { name: /game over/i })).not.toBeInTheDocument();
  });

  it(`shows game over modal with new game`, async () => {
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
    await userEvent.click(await screen.findByRole('button', { name: /new game/i }));
    expect(assign).toHaveBeenCalledWith('/');

    restoreLocation();
  });

  test('render snapshot', () => {
    const gameState = createGameState(1);
    const view = render(
      <GameArea
        gameId={'123A'}
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={2}
      />
    );
    expect(view).toMatchSnapshot();
  });
});
