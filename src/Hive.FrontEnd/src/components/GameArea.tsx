import '../css/gameArea.css';

import { useContext, useEffect, useState } from 'preact/hooks';
import { FunctionComponent } from 'preact';

import { Cell, GameState, GameStatus, PlayerId } from '../domain';
import { HextilleBuilder, HiveDispatcher, HiveEvent } from '../services';
import { Dispatcher, useHiveDispatchListener } from '../utilities/dispatcher';
import { handleDragOver } from '../utilities/handlers';
import { cellKey, removeOtherPlayerMoves, resetOtherPlayerSelected } from '../utilities/hextille';
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

type Properties = GameState & { currentPlayer: PlayerId; aiMode?: AiMode };

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

const GameArea: FunctionComponent<Properties> = ({
  players,
  cells,
  gameId,
  gameStatus,
  currentPlayer,
  aiMode = 'off',
}) => {
  const [currentDialog, setCurrentDialog] = useState<CurrentDialog>('none');
  const [playerConnected, setPlayerConnected] = useState<'connected' | 'disconnected' | false>(false);
  const closeDialog = () => setCurrentDialog('none');
  const dispatcher = useContext<HiveDispatcher>(Dispatcher);

  const openDialog = (dialog: Exclude<CurrentDialog, 'none'>) => {
    if (dialog != 'gameOver') setTimeout(() => setCurrentDialog(dialog), 100);
    closeDialog();
  };

  const shareComponent = async () => {
    const result = await shareGame(gameId, currentPlayer);
    if (result) openDialog('share');
  };

  const hextilleBuilder = new HextilleBuilder(cells);
  const rows = hextilleBuilder.createRows();

  useEffect(() => {
    if (gameOutcome(gameStatus, currentPlayer) !== '') setCurrentDialog('gameOver');
  }, [gameStatus, currentPlayer]);

  useEffect(() => {
    resetOtherPlayerSelected({ players, cells }, dispatcher);
  }, [players, cells, dispatcher]);

  useHiveDispatchListener<HiveEvent>('opponentConnected', () => {
    setPlayerConnected('connected');
    openDialog('playerConnected');
  });

  useHiveDispatchListener<HiveEvent>('opponentDisconnected', () => {
    setPlayerConnected('disconnected');
    openDialog('playerConnected');
  });

  removeOtherPlayerMoves(currentPlayer, { players, cells });

  return (
    <main onDragOver={handleDragOver} title="Hive Game Area">
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
                <GameCell key={cellKey(cell.coords)} coords={cell.coords} hidden={!!cell.hidden}>
                  <Tiles cell={cell} currentPlayer={currentPlayer} />
                </GameCell>
              ))}
            </Row>
          ))}
        </Hextille>
      </section>
      <Modal
        isOpen={currentDialog === 'playerConnected'}
        onClose={closeDialog}
        title="Player Connected"
        class="player-connected">
        <p>Player has {playerConnected}!</p>
      </Modal>
      <Modal isOpen={currentDialog === 'rules'} onClose={closeDialog} title="Game Rules" class="rules">
        <Rules />
      </Modal>
      <Modal isOpen={currentDialog === 'share'} onClose={closeDialog} title="Linked Shared" class="share">
        <p>Opponent's link has been copied to clipboard!</p>
      </Modal>
      <Modal isOpen={currentDialog === 'gameOver'} onClose={closeDialog} title="Game Over" class="game-over">
        <GameOver outcome={gameOutcome(gameStatus, currentPlayer)} />
      </Modal>
    </main>
  );
};
GameArea.displayName = 'GameArea';
export default GameArea;
