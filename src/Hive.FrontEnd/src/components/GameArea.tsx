import '../css/gameArea.css';

import { useContext, useEffect, useState } from 'preact/hooks';
import { FunctionComponent } from 'preact';

import { Cell, GameState, GameStatus, HexCoordinates, PlayerId } from '../domain';
import { ConnectEvent, HextilleBuilder, HiveDispatcher } from '../services';
import { handleDragOver } from '../utilities/handlers';
import { cellKey, removeOtherPlayerMoves } from '../utilities/hextille';
import { shareGame } from '../utilities/share';
import { AiMode } from '../domain/engine';
import GameCell from './GameCell';
import GameOver from './GameOver';
import GameTile from './GameTile';
import Hextille from './Hextille';
import Links from './Links';
import Modal from './Modal';
import Players from './Players';
import Row from './Row';
import Rules from './Rules';
import { HistoricalMove } from '../domain/historical-move';
import { Dispatcher, useHiveDispatchListener } from '../hooks/useHiveDispatchListener';
import { Signal, useComputed, useSignal } from '@preact/signals';

type Properties = GameState & { currentPlayer: PlayerId; aiMode: Signal<AiMode> };

const gameOutcome = (gameStatus: GameStatus, playerId: PlayerId) => {
  switch (gameStatus) {
    case 'AiWin':
      return 'Game Over! Ai Wins';

    case 'Player0Win':
      return `Game Over! You ${playerId == 0 ? 'Win!' : 'Lose!'}`;

    case 'Player1Win':
      return `Game Over! You ${playerId == 1 ? 'Win!' : 'Lose!'}`;

    case 'GameOver':
      return `Game is over`;

    case 'Draw':
      return `Game Over! Draw`;

    default:
      break;
  }
  return '';
};

const Tiles: FunctionComponent<{ cell: Cell; currentPlayer: PlayerId }> = ({ cell, currentPlayer }) => {
  cell.tiles.reverse();

  return (
    <>
      {cell.tiles.map((tile, index) => (
        <GameTile
          key={tile.id}
          currentPlayer={currentPlayer}
          {...tile}
          stacked={index === cell.tiles.length - 1 && cell.tiles.length > 1}
        />
      ))}
    </>
  );
};

type CurrentDialog = 'none' | 'rules' | 'share' | 'playerConnected' | 'gameOver';
const isPreviousMove = (history: HistoricalMove[], coords: HexCoordinates) => {
  if (!history.length) return false;
  const previousMove = history[history.length - 1];
  return (
    (previousMove.move.coords.q === coords.q && previousMove.move.coords.r === coords.r) ||
    (previousMove.originalCoords?.q === coords.q && previousMove.originalCoords.r === coords.r)
  );
};

const GameArea: FunctionComponent<Properties> = ({
  players,
  cells,
  history,
  gameId,
  gameStatus,
  currentPlayer,
  aiMode,
}) => {
  const currentDialog = useSignal<CurrentDialog>('none');
  const showGameOver = useComputed<boolean>(() => currentDialog.value === 'gameOver');
  const showPlayerConnected = useComputed<boolean>(() => currentDialog.value === 'playerConnected');
  const showShare = useComputed<boolean>(() => currentDialog.value === 'share');
  const showRules = useComputed<boolean>(() => currentDialog.value === 'rules');
  const [playerConnected, setPlayerConnected] = useState<'connected' | 'disconnected' | false>(false);
  const closeDialog = () => (currentDialog.value = 'none');
  const dispatcher = useContext<HiveDispatcher>(Dispatcher);

  const openDialog = (dialog: Exclude<CurrentDialog, 'none'>) => {
    if (dialog != 'gameOver') currentDialog.value = dialog;
  };

  const shareComponent = async () => {
    const result = await shareGame(gameId, currentPlayer);
    if (result) openDialog('share');
  };

  const hextilleBuilder = new HextilleBuilder(cells);
  const rows = hextilleBuilder.createRows();

  useEffect(() => {
    if (gameOutcome(gameStatus, currentPlayer) !== '') currentDialog.value = 'gameOver';
  }, [gameStatus, currentPlayer]);

  useHiveDispatchListener<ConnectEvent>('opponentConnected', ({ playerId }) => {
    if (playerId !== currentPlayer) {
      aiMode.value = 'off';
      setPlayerConnected('connected');
      openDialog('playerConnected');
    }
  });

  useHiveDispatchListener<ConnectEvent>('opponentDisconnected', ({ playerId }) => {
    if (playerId !== currentPlayer) {
      setPlayerConnected('disconnected');
      openDialog('playerConnected');
    }
  });

  removeOtherPlayerMoves(currentPlayer, { players, cells });
  dispatcher.dispatch({ type: 'tileClear' });
  return (
    <main
      onDragOver={handleDragOver}
      title="Hive Game Area"
      class={gameOutcome(gameStatus, currentPlayer) === '' ? undefined : 'game-over'}>
      <Players currentPlayer={currentPlayer} players={players} />
      <section title="Game playing area">
        <Links
          onShowRules={() => openDialog('rules')}
          onShowShare={shareComponent}
          gameId={gameId}
          currentPlayer={currentPlayer}
          aiMode={aiMode}
        />
        <Hextille>
          {rows.map((row) => (
            <Row key={row.id} {...row}>
              {row.cells.map((cell) => (
                <GameCell
                  historical={isPreviousMove(history || [], cell.coords)}
                  key={cellKey(cell.coords)}
                  coords={cell.coords}
                  hidden={!!cell.hidden}>
                  <Tiles cell={cell} currentPlayer={currentPlayer} />
                </GameCell>
              ))}
            </Row>
          ))}
        </Hextille>
      </section>
      <Modal
        open={showPlayerConnected}
        onClose={closeDialog}
        title="Player Connected"
        class="player-connected">
        <p>Player has {playerConnected}!</p>
      </Modal>
      <Modal open={showRules} onClose={closeDialog} title="Game Rules" class="rules">
        <Rules />
      </Modal>
      <Modal open={showShare} onClose={closeDialog} title="Linked Shared" class="share">
        <p>Opponent's link has been copied to clipboard!</p>
      </Modal>
      <Modal open={showGameOver} onClose={closeDialog} title="Game Over" class="game-over">
        <GameOver outcome={gameOutcome(gameStatus, currentPlayer)} />
      </Modal>
    </main>
  );
};
GameArea.displayName = 'GameArea';
export default GameArea;
