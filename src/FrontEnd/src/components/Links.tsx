import { FunctionComponent, h } from 'preact';

type Props = { onShowRules: () => void; onShowShare: () => void };
const Links: FunctionComponent<Props> = (props) => {
  const handle = (handler: () => void) => (e: MouseEvent) => {
    e.preventDefault();
    handler();
    return false;
  };

  return (
    <div class="links">
      <a href="#" name="Share game to opponent" title="Share" onClick={handle(props.onShowShare)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <use href="#share" />
        </svg>
      </a>{' '}
      <a href="/" name="New game!" title="New Game">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <use href="#new" />
        </svg>
      </a>
      <a href="#" name="Show rules" onClick={handle(props.onShowRules)} title="Rules">
        ?
      </a>
      <a class="github" href="https://github.com/SpiralLogic/hive" title="Source code">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <use href="#github" />
        </svg>
      </a>
    </div>
  );
};

Links.displayName = 'Links';
export default Links;
