import { FunctionComponent, Fragment } from 'preact';
import '../css/share.css';

const GameOver: FunctionComponent<{ outcome: string }> = ({ outcome }) => {
  return (
    <Fragment>
      <p>{outcome}</p>
      <button autofocus title="New Game" onClick={() => window.location.assign(`/`)}>
        Close
      </button>
    </Fragment>
  );
};
GameOver.displayName = 'GameOver';
export default GameOver;
