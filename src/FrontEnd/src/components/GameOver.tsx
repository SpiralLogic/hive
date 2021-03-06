import { FunctionComponent, h } from 'preact';
import '../css/share.css';

const GameOver: FunctionComponent<{ outcome: string }> = ({ outcome }) => {
  return (
    <>
      <p>{outcome}</p>
      <button autofocus title="New Game" onClick={() => window.location.assign(`/`)}>
        Close
      </button>
    </>
  );
};
GameOver.displayName = 'GameOver';
export default GameOver;
