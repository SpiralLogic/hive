import '../css/gameArea.css';

import { FunctionComponent } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';

import { Cell, GameState, GameStatus, PlayerId } from '../domain';
import { HextilleBuilder, HiveEvent } from '../services';
import { Dispatcher, useHiveDispatchListener } from '../utilities/dispatcher';
import { handleDragOver } from '../utilities/handlers';
import { cellKey, removeOtherPlayerMoves, resetOtherPlayerSelected } from '../utilities/hextille';
import { shareGame } from '../utilities/share';
import GameCell from './GameCell';
import GameOver from './GameOver';
import GameTile from './GameTile';
import Hextille from './Hextille';
import Links from './Links';
import Modal from './Modal';
import PlayerConnected from './PlayerConnected';
import Players from './Players';
import Row from './Row';
import Rules from './Rules';

type Properties = GameState & { currentPlayer: PlayerId };

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
const createTiles = (cell: Cell, currentCellPlayer: PlayerId) => {
  cell.tiles.reverse();
  return cell.tiles.map((tile, index) => (
    <GameTile
      key={tile.id}
      currentPlayer={currentCellPlayer}
      {...tile}
      stacked={index === cell.tiles.length - 1 && cell.tiles.length > 1}
    />
  ));
};

const GameArea: FunctionComponent<Properties> = ({ players, cells, gameId, gameStatus, currentPlayer }) => {
  const [showRules, setShowRules] = useState<boolean>(false);
  const [showShare, setShowShare] = useState<boolean>(false);
  const [playerConnected, setPlayerConnected] = useState<'connected' | 'disconnected' | false>(false);
  const [showGameOver, setShowGameOver] = useState<boolean>(
    () => gameOutcome(gameStatus, currentPlayer) !== ''
  );
  const dispatcher = useContext(Dispatcher);
  const shareComponent = async () => {
    const result = await shareGame(gameId, currentPlayer);
    setShowShare(result);
  };

  const attributes = { ondragover: handleDragOver };
  const hextilleBuilder = new HextilleBuilder(cells);
  const rows = hextilleBuilder.createRows();

  useEffect(() => {
    setShowGameOver(gameOutcome(gameStatus, currentPlayer) !== '');
  }, [gameStatus, currentPlayer]);

  useHiveDispatchListener<HiveEvent>('opponentConnected', () => {
    setPlayerConnected('connected');
  });

  useHiveDispatchListener<HiveEvent>('opponentDisconnected', () => {
    setPlayerConnected('disconnected');
  });

  removeOtherPlayerMoves(currentPlayer, { players, cells });
  resetOtherPlayerSelected(currentPlayer, { players, cells }, dispatcher);

  return (
    <main {...attributes} title={'Hive Game Area'}>
      <Players currentPlayer={currentPlayer} players={players} />
      <section title="Pieces not yet in play">
        <Links
          onShowRules={setShowRules}
          onShowShare={shareComponent}
          gameId={gameId}
          currentPlayer={currentPlayer}
        />
        <Hextille>
          {rows.map((row) => (
            <Row key={row.id} {...row}>
              {row.cells.map((cell) => (
                <GameCell key={cellKey(cell.coords)} coords={cell.coords} hidden={!!cell.hidden}>
                  {createTiles(cell, currentPlayer)}
                </GameCell>
              ))}
            </Row>
          ))}
        </Hextille>
      </section>
      <Modal isOpen={!!playerConnected} name="player-connected" onClose={() => setPlayerConnected(false)}>
        <PlayerConnected connected={playerConnected} />
      </Modal>
      <Modal isOpen={showRules} onClose={() => setShowRules(false)} name="rules">
        <Rules />
      </Modal>
      <Modal isOpen={showShare} onClose={() => setShowShare(false)} name="share">
        <p>Opponent's link has been copied to clipboard!</p>
      </Modal>
      <Modal isOpen={showGameOver} onClose={() => setShowGameOver(false)} name="game-over">
        <GameOver outcome={gameOutcome(gameStatus, currentPlayer)} />
      </Modal>
    </main>
  );
};
GameArea.displayName = 'GameArea';
export default GameArea;
