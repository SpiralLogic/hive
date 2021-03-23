import '../css/share.css';
import { FunctionComponent, h } from 'preact';
import Modal from './Modal';

const GameOver: FunctionComponent<{ win: boolean }> = ({ win }) => {
  const newGame = () => {
    window.location.assign(`/${location.search}`);
  };
  return (
    <Modal name="game over" onClose={newGame}>
      <p>Game Over! {win ? 'You win!' : ' Your Lose!'}</p>
      <button title="New Game" onClick={newGame}>
        Close
      </button>
    </Modal>
  );
};
GameOver.displayName = 'GameOver';
export default GameOver;
