import '../css/share.css';
import { FunctionComponent, h } from 'preact';
import { GameStatus, PlayerId } from '../domain';
import Modal from './Modal';

const newGame = () => window.location.assign(`/`);

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

const GameOver: FunctionComponent<{ gameStatus: GameStatus; playerId: PlayerId }> = ({ gameStatus, playerId }) => {
  const outcome = gameOutcome(gameStatus, playerId);
  return outcome ? (
    <Modal name='game over' onClose={newGame}>
      <p>{outcome}</p>
      <button autofocus title='New Game' onClick={newGame}>
        Close
      </button>
    </Modal>
  ) : null;
};
GameOver.displayName = 'GameOver';
export default GameOver;
