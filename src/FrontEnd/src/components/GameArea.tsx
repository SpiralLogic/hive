import { FunctionComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import '../css/gameArea.css';
import { GameState, GameStatus, PlayerId } from '../domain';
import { HextilleBuilder, HiveEvent } from '../services';
import { addHiveDispatchListener } from '../utilities/dispatcher';
import { handleDragOver } from '../utilities/handlers';
import { cellKey, removeOtherPlayerMoves } from '../utilities/hextille';
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

type Props = Omit<GameState, 'gameId'> & { currentPlayer: PlayerId };

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
    case 'NewGame':
    case 'MoveSuccess':
    case 'MoveSuccessNextPlayerSkipped':
    case 'MoveInvalid':
      return '';
  }
};

const GameArea: FunctionComponent<Props> = ({ players, cells, currentPlayer, gameStatus }) => {
  const [showRules, setShowRules] = useState<boolean>(false);
  const [showShare, setShowShare] = useState<boolean>(false);
  const [playerConnected, setPlayerConnected] = useState<'connected' | 'disconnected' | false>(false);

  const shareComponent = () => {
    setShowShare(shareGame(currentPlayer));
  };

  const attributes = { ondragover: handleDragOver, className: 'hive' };
  const hextilleBuilder = new HextilleBuilder(cells);
  const rows = hextilleBuilder.createRows();

  addHiveDispatchListener<HiveEvent>('opponentConnected', () => {
    setPlayerConnected('connected');
  });

  addHiveDispatchListener<HiveEvent>('opponentDisconnected', () => {
    setPlayerConnected('disconnected');
  });

  removeOtherPlayerMoves(currentPlayer, { players, cells });
  return (
    <div {...attributes} title={'Hive Game Area'}>
      <Players currentPlayer={currentPlayer} players={players} />
      <main>
        <Links onShowRules={setShowRules} onShowShare={() => shareComponent()} currentPlayer={currentPlayer} />
        <Hextille>
          {rows.map((row) => (
            <Row key={row.id} {...row}>
              {row.cells.map((cell) => (
                <GameCell key={cellKey(cell.coords)} coords={cell.coords} hidden={!!cell.hidden}>
                  {cell.tiles.reverse().map((tile, i) => (
                    <GameTile
                      key={tile.id}
                      currentPlayer={currentPlayer}
                      {...tile}
                      stacked={i === cell.tiles.length - 1 && cell.tiles.length > 1}
                    />
                  ))}
                </GameCell>
              ))}
            </Row>
          ))}
        </Hextille>
      </main>
      <Modal visible={!!playerConnected} name='player connected' onClose={() => setPlayerConnected(false)}>
        <PlayerConnected connected={playerConnected} />
      </Modal>
      <Modal visible={showRules} name='rules' onClose={() => setShowRules(false)}>
        <Rules />
      </Modal>
      <Modal visible={showShare} name='share' onClose={() => setShowShare(false)}>
        <p>Opponent's link has been copied to clipboard!</p>
      </Modal>
      <Modal visible={gameOutcome(gameStatus, currentPlayer) !== ''} name='game over' onClose={() => window.location.assign(`/`)}>
        <GameOver outcome={gameOutcome(gameStatus, currentPlayer)} />
      </Modal>
    </div>
  );
};

GameArea.displayName = 'GameArea';
export default GameArea;
