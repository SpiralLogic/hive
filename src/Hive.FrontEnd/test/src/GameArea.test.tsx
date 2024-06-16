import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import GameArea from '../../src/components/GameArea';
import { GameState, GameStatus } from '@hive/domain';
import { ConnectEvent, HiveDispatcher } from '@hive/services';
import { createGameState } from '../fixtures/game-area.fixtures';
import { mockClipboard, mockLocation, mockShare, noShare, simulateEvent } from '../helpers';
import { vi } from 'vitest';
import { waitFor } from '@testing-library/dom';
import { Dispatcher } from '@hive/hooks/useHiveDispatchListener';
import { Signal, signal } from '@preact/signals';
import { AiMode } from '@hive/domain/engine';
import { GameStateContext } from '@hive/services/game-state-context.ts';
import { ComponentProps } from 'preact';
import { signalize } from '../helpers/signalize';

const setup = (gameState: GameState, props: ComponentProps<typeof GameArea>) => {
  const gameStateContext = {
    ...signalize(gameState),
    setGameState: vi.fn(),
  };

  const dispatcher = new HiveDispatcher();

  return {
    ...render(
      <Dispatcher.Provider value={dispatcher}>
        <GameStateContext.Provider value={gameStateContext}>
          <GameArea {...(props)} />
        </GameStateContext.Provider>
      </Dispatcher.Provider>
    ),
    dispatcher,
  };
};
describe('<GameArea>', () => {
  test('default drag over is prevented to allow drop', () => {
    const gameState = createGameState(1);
    setup(gameState, { currentPlayer: 2, aiMode: signal('off') });
    const preventDefault = simulateEvent(screen.getByTitle('Hive Game Area'), 'dragover');

    expect(preventDefault).toHaveBeenCalledWith();
  });

  it(`resets all selected tiles which aren't the current player`, async () => {
    const gameState = createGameState(1);
    global.window.history.replaceState({}, global.document.title, `/game/33/0`);

    const { dispatcher } = setup(gameState, { currentPlayer: 1, aiMode: signal('off') });
    dispatcher.dispatch({ type: 'tileSelect', tile: gameState.players[1].tiles[0] });
    await waitFor(() => expect(screen.getByTitle(/ant/)).toHaveClass('selected'));
  });

  it(`removes all moves for tiles which aren't the current player`, async () => {
    const gameState = createGameState(1);
    global.window.history.replaceState({}, global.document.title, `/game/33/0`);
    setup(gameState, { currentPlayer: 1, aiMode: signal('off') });

    expect(screen.getByTitle(/beetle/)).toHaveAttribute('draggable', 'false');
    expect(screen.getByTitle(/ant/)).toHaveAttribute('draggable');
  });
});

describe('<GameArea> rules dialog', () => {
  it('opens show rules', async () => {
    const gameState = createGameState(1);
    setup(gameState, { currentPlayer: 1, aiMode: signal('off') });

    await userEvent.click(screen.getByTitle(/Rules/));

    expect(await screen.findByRole('dialog', { name: /game rules/i })).toBeInTheDocument();
  });

  it(`closes show rules`, async () => {
    const gameState = createGameState(1);
    setup(gameState, { currentPlayer: 1, aiMode: signal('off') });

    await userEvent.click(screen.getByTitle(/rules/i));
    await userEvent.click(await screen.findByRole(/button/i, { hidden: false, name: /close dialog/i }));
    expect(screen.queryByRole('dialog', { name: /game rules/i })).not.toBeInTheDocument();
  });
});
describe('<GameArea> share dialog', () => {
  it('opens share dialog', async () => {
    const gameState = createGameState(1);
    const [restore] = mockClipboard();

    setup(gameState, { currentPlayer: 0, aiMode: signal('off') });

    await userEvent.click(screen.getByTitle(/Share/));

    expect(await screen.findByRole('dialog', { name: /linked shared/i })).toBeInTheDocument();
    restore();
  });

  it(`closes share dialog`, async () => {
    const gameState = createGameState(1);
    const [restore] = mockClipboard();

    setup(gameState, { currentPlayer: 0, aiMode: signal('off') });

    await userEvent.click(screen.getByTitle(/Share/));
    await userEvent.click(await screen.findByRole(/button/i, { hidden: false, name: /close dialog/i }));
    expect(screen.queryByRole('dialog', { name: /linked shared/i, hidden: false })).not.toBeInTheDocument();
    restore();
  });

  it('calls share API', async () => {
    const [restore, share] = mockShare();
    const gameState = createGameState(1);
    global.window.history.replaceState({}, global.document.title, `/game/33/1`);
    setup(gameState, { currentPlayer: 1, aiMode: signal('off') });

    await userEvent.click(screen.getByTitle(/Share/));
    expect(share).toHaveBeenCalledWith(
      expect.objectContaining({ url: expect.stringContaining('/game/33/0') })
    );
    restore();
  });

  it('copies opponent link to clipboard with navigator', async () => {
    const [restore1] = noShare();
    const [restore2, writeText] = mockClipboard();

    const gameState = createGameState(1);
    setup(gameState, { currentPlayer: 1, aiMode: signal('off') });

    await userEvent.click(screen.getByTitle(/Share/));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('/game/33/0'));
    restore1();
    restore2();
  });

  it('copies opponent link to clipboard with exec command', async () => {
    const [restore] = noShare();
    const gameState = createGameState(1);
    setup(gameState, { currentPlayer: 1, aiMode: signal('off') });

    await userEvent.click(screen.getByTitle(/Share/));
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    restore();
  });

  it(`closes dialog when share link can't be copied`, async () => {
    const [restore] = noShare();
    const gameState = createGameState(1);
    setup(gameState, { currentPlayer: 1, aiMode: signal('off') });

    await userEvent.click(screen.getByTitle(/Share/));
    expect(screen.queryByRole('dialog', { name: /linked shared/i })).not.toBeInTheDocument();
    restore();
  });

  it.each<[ConnectEvent['type'], RegExp]>([
    ['opponentConnected', /connected/i],
    ['opponentDisconnected', /disconnected/i],
  ])(`opens dialog when player %s`, async (connectionState, expected) => {
    const gameState = createGameState(1);
    const { dispatcher } = setup(gameState, { currentPlayer: 1, aiMode: signal('off') });

    dispatcher.dispatch({ type: connectionState, playerId: 0 });

    expect(await screen.findByText(expected)).toBeInTheDocument();
  });

  it.each<[ConnectEvent['type'], RegExp]>([
    ['opponentConnected', /player connected/i],
    ['opponentDisconnected', /player disconnected/i],
  ])(`closes the dialog for player %s when close button is clicked`, async (connectionState, expected) => {
    const gameState = createGameState(1);

    const { dispatcher } = setup(gameState, { currentPlayer: 0, aiMode: signal('off') });

    dispatcher.dispatch({ type: connectionState, playerId: 1 });

    await userEvent.click(await screen.findByRole(/button/i, { hidden: false, name: /close dialog/i }));
    expect(screen.queryByRole('dialog', { name: expected })).not.toBeInTheDocument();
  });
});

describe('ai toggle', () => {
  let dispatcher: HiveDispatcher;
  let aiMode: Signal<AiMode>;
  const toggleAiHandler = vi.fn();

  beforeEach(() => {
    const gameState = createGameState(1);
    aiMode = signal('on');
    const view = setup(gameState, { currentPlayer: 0, aiMode });
    dispatcher = view.dispatcher;
  });

  it(`toggles ai mode when opponent connects`, () => {
    dispatcher.dispatch({ type: 'opponentConnected', playerId: 1 });
    expect(aiMode.value).toBe('off');
  });

  it(`doesn't toggle ai mode when connected opponent is current player`, () => {
    dispatcher.dispatch({ type: 'opponentConnected', playerId: 0 });
    expect(toggleAiHandler).not.toHaveBeenCalled();
  });
});

describe('<GameArea> game status dialog', () => {
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
    `shows game status %s dialog for player 1 with current player %i`,
    async (gameStatus, currentPlayer) => {
      const gameState = createGameState(1);
      setup({ ...gameState, gameStatus }, { currentPlayer, aiMode: signal('off') });

      expect(await screen.findByRole('dialog', { name: /game over/i })).toBeInTheDocument();
    }
  );

  it.each(gameStatusNotShownDialogs)(`doesn't show game status %s dialog for player 1`, (gameStatus) => {
    const gameState = createGameState(1);
    setup({ ...gameState, gameStatus }, { currentPlayer: 0, aiMode: signal('off') });

    expect(screen.queryByRole('dialog', { name: /game over/i })).not.toBeInTheDocument();
  });

  it.each(gameStatusShownDialogs)(`shows game status %s dialog for player 2`, async (gameStatus) => {
    const gameState = createGameState(1);
    setup({ ...gameState, gameStatus }, { currentPlayer: 0, aiMode: signal('off') });

    expect(await screen.findByRole('dialog', { name: /game over/i })).toBeInTheDocument();
  });

  it.each(gameStatusNotShownDialogs)(`doesn't show game status %s dialog for player 2`, (gameStatus) => {
    const gameState = createGameState(1);
    setup({ ...gameState, gameStatus }, { currentPlayer: 0, aiMode: signal('off') });

    expect(screen.queryByRole('dialog', { name: /game over/i })).not.toBeInTheDocument();
  });

  it(`closes game over dialog`, async () => {
    const gameState = createGameState(1);
    setup({ ...gameState, gameStatus: 'GameOver' }, { currentPlayer: 0, aiMode: signal('off') });

    await userEvent.click(await screen.findByRole(/button/i, { hidden: false, name: /close dialog/i }));
    expect(screen.queryByRole('dialog', { name: /game over/i })).not.toBeInTheDocument();
  });

  it(`set's game over class when game is over`, async () => {
    const gameState = createGameState(1);
    setup({ ...gameState, gameStatus: 'GameOver' }, { currentPlayer: 0, aiMode: signal('off') });

    expect(screen.getByRole('main')).toHaveClass('game-over');
  });

  it(`shows game over dialog with new game button`, async () => {
    const assign = vi.fn();
    const restoreLocation = mockLocation({ assign });
    const gameState = createGameState(1);

    setup({ ...gameState, gameStatus: 'GameOver' }, { currentPlayer: 0, aiMode: signal('off') });

    await userEvent.click(await screen.findByRole('button', { name: /new game/i }));
    expect(assign).toHaveBeenCalledWith('/');

    restoreLocation();
  });
});

describe('<GameArea> snapshots', () => {
  it('matches', () => {
    const gameState = createGameState(1);
    const view = setup(
      { ...gameState, gameStatus: 'MoveSuccess' },
      { currentPlayer: 1, aiMode: signal('off') }
    );

    expect(view).toMatchSnapshot();
  });

  it('matches with historical move', () => {
    const gameState = createGameState(1, true);

    const view = setup(gameState, { currentPlayer: 0, aiMode: signal('off') });

    expect(view).toMatchSnapshot();
  });

  it('matches game over', () => {
    const gameState = createGameState(1);
    const view = setup({ ...gameState, gameStatus: 'GameOver' }, { currentPlayer: 0, aiMode: signal('off') });

    expect(view).toMatchSnapshot();
  });
});
