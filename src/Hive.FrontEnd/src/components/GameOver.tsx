import '../css/share.css';

import { FunctionComponent } from 'preact';

const GameOver: FunctionComponent<{ outcome: string }> = ({ outcome }) => (
  <>
    <p>{outcome}</p>
    <button autofocus title="New Game" onClick={() => window.location.assign(`/`)}>
      New Game
    </button>
  </>
);
GameOver.displayName = 'GameOver';
export default GameOver;
