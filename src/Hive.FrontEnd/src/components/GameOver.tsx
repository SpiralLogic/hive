import '../css/share.css';

const GameOver = ({ outcome }: { outcome: string }) => (
  <>
    <p>{outcome}</p>
    <button autofocus title="New Game" onClick={() => window.location.assign(`/`)}>
      New Game
    </button>
  </>
);
GameOver.displayName = 'GameOver';
export default GameOver;
