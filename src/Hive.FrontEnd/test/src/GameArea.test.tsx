import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import GameArea from '../../src/components/GameArea';
import { GameStatus } from '../../src/domain';
import { ConnectEvent, HiveDispatcher, TileAction } from '../../src/services';
import { createGameState } from '../fixtures/game-area.fixtures';
import { mockClipboard, mockExecCommand, mockLocation, mockShare, noShare, simulateEvent } from '../helpers';
import { MockedFunction } from 'vitest';
import { waitFor } from '@testing-library/dom';
import { Dispatcher } from '../../src/hooks/useHiveDispatchListener';
import { Signal, signal } from '@preact/signals';
import { AiMode } from '../../src/domain/engine';

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
        aiMode={signal('off')}
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
          aiMode={signal('off')}
        />
      </Dispatcher.Provider>
    );
    dispatcher.dispatch<TileAction>({ type: 'tileSelect', tile: gameState.players[1].tiles[0] });
    await waitFor(() => expect(screen.getByTitle(/creature1/)).toHaveClass('selected'));
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
          aiMode={signal('off')}
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
        aiMode={signal('off')}
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
        aiMode={signal('off')}
      />
    );

    await userEvent.click(screen.getByTitle(/rules/i));
    await userEvent.click(await screen.findByRole(/button/i, { hidden: false, name: /close dialog/i }));
    expect(screen.queryByRole('dialog', { name: /game rules/i })).not.toBeInTheDocument();
  });

  it('opens share modal', async () => {
    const clipboard = vi.fn() as MockedFunction<() => Promise<void>>;
    const gameState = createGameState(1);
    const restore = mockClipboard(clipboard);

    render(
      <GameArea
        gameId={'123A'}
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={0}
        aiMode={signal('off')}
      />
    );

    await userEvent.click(screen.getByTitle(/Share/));

    expect(await screen.findByRole('dialog', { name: /linked shared/i })).toBeInTheDocument();
    restore();
  });

  it(`closes share modal`, async () => {
    const clipboard = vi.fn() as MockedFunction<() => Promise<void>>;
    const gameState = createGameState(1);
    const restore = mockClipboard(clipboard);

    render(
      <GameArea
        gameId={'123A'}
        gameStatus={'MoveSuccess'}
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={0}
        aiMode={signal('off')}
      />
    );
    await userEvent.click(screen.getByTitle(/Share/));
    await userEvent.click(await screen.findByRole(/button/i, { hidden: false, name: /close dialog/i }));
    expect(screen.queryByRole('dialog', { name: /linked shared/i, hidden: false })).not.toBeInTheDocument();
    restore();
  });

  it('calls share API', async () => {
    const share = vi.fn() as MockedFunction<() => Promise<void>>;
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
        aiMode={signal('off')}
      />
    );

    await userEvent.click(screen.getByTitle(/Share/));
    expect(share).toHaveBeenCalledWith(
      expect.objectContaining({ url: expect.stringContaining('/game/33/0') })
    );
    restore();
  });

  it('copies opponent link to clipboard with navigator', async () => {
    const writeText = vi.fn() as MockedFunction<() => Promise<void>>;
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
        aiMode={signal('off')}
      />
    );
    await userEvent.click(screen.getByTitle(/Share/));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('/game/33/0'));
    restore1();
    restore2();
  });

  it('copies opponent link to clipboard with exec command', async () => {
    const execCommand = vi.fn() as MockedFunction<() => void>;
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
        aiMode={signal('off')}
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
        aiMode={signal('off')}
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
          aiMode={signal('off')}
        />
      </Dispatcher.Provider>
    );
    dispatcher.dispatch<ConnectEvent>({ type: connectionState, playerId: 0 });

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
          aiMode={signal('off')}
        />
      </Dispatcher.Provider>
    );
    dispatcher.dispatch<ConnectEvent>({ type: connectionState, playerId: 1 });

    await userEvent.click(await screen.findByRole(/button/i, { hidden: false, name: /close dialog/i }));
    expect(screen.queryByRole('dialog', { name: expected })).not.toBeInTheDocument();
  });

  describe('ai toggle', () => {
    let dispatcher: HiveDispatcher;
    let aiMode: Signal<AiMode>;
    const toggleAiHandler = vi.fn();
    beforeEach(() => {
      dispatcher = new HiveDispatcher();

      const gameState = createGameState(1);
      aiMode = signal('on');
      render(
        <Dispatcher.Provider value={dispatcher}>
          <GameArea
            gameId={'123A'}
            gameStatus={'MoveSuccess'}
            players={gameState.players}
            cells={gameState.cells}
            currentPlayer={0}
            aiMode={aiMode}
          />
        </Dispatcher.Provider>
      );
    });
    it(`opponent connected handler toggles ai mode`, () => {
      dispatcher.dispatch<ConnectEvent>({ type: 'opponentConnected', playerId: 1 });
      expect(aiMode.value).toBe('off');
    });

    it(`opponent connected handler doesn't toggle ai mode for current player`, () => {
      dispatcher.dispatch<ConnectEvent>({ type: 'opponentConnected', playerId: 0 });
      expect(toggleAiHandler).not.toHaveBeenCalled();
    });
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
          aiMode={signal('off')}
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
        aiMode={signal('off')}
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
        aiMode={signal('off')}
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
        aiMode={signal('off')}
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
        aiMode={signal('off')}
      />
    );
    await userEvent.click(await screen.findByRole(/button/i, { hidden: false, name: /close dialog/i }));
    expect(screen.queryByRole('dialog', { name: /game over/i })).not.toBeInTheDocument();
  });

  it(`set's game over class when game is over`, async () => {
    const gameState = createGameState(1);

    render(
      <GameArea
        gameId={'123A'}
        gameStatus={'GameOver'}
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={0}
        aiMode={signal('off')}
      />
    );

    expect(screen.getByRole('main')).toHaveClass('game-over');
  });

  it(`shows game over modal with new game button`, async () => {
    const assign = vi.fn();
    const restoreLocation = mockLocation({ assign });
    const gameState = createGameState(1);

    render(
      <GameArea
        gameId={'123A'}
        gameStatus={'GameOver'}
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={0}
        aiMode={signal('off')}
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
        currentPlayer={1}
        aiMode={signal('off')}
      />
    );
    expect(view).toMatchSnapshot();
  });

  test('render snapshot with historical move', () => {
    const gameState = createGameState(1, true);
    const view = render(
      <GameArea
        gameId={'123A'}
        gameStatus="MoveSuccess"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
        aiMode={signal('off')}
        history={gameState.history}
      />
    );
    expect(view).toMatchSnapshot();
  });

  test('render game over snapshot', () => {
    const gameState = createGameState(1);
    const view = render(
      <GameArea
        gameId={'123A'}
        gameStatus="GameOver"
        players={gameState.players}
        cells={gameState.cells}
        currentPlayer={1}
        aiMode={signal('off')}
      />
    );
    expect(view).toMatchSnapshot();
  });
});
