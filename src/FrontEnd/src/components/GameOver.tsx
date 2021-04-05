import '../css/share.css';
import { FunctionComponent, h } from 'preact';
import Modal from './Modal';
const newGame = () => window.location.assign(`/`);
const GameOver: FunctionComponent<{ win: boolean }> = ({ win }) => (
  <Modal name="game over" onClose={newGame}>
    <p>Game Over! {win ? 'You Win!' : ' You Lose!'}</p>
    <button title="New Game" onClick={newGame}>
      Close
    </button>
  </Modal>
);
GameOver.displayName = 'GameOver';
export default GameOver;
