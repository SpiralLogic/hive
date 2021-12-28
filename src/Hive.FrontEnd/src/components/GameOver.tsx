import '../css/share.css';

import { Fragment, FunctionComponent } from 'preact';

const GameOver: FunctionComponent<{ outcome: string }> = ({ outcome }) => (
  <Fragment>
    <p>{outcome}</p>
    <button autofocus title="New Game" onClick={() => window.location.assign(`/`)}>
      New Game
    </button>
  </Fragment>
);
GameOver.displayName = 'GameOver';
export default GameOver;
