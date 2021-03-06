import { FunctionComponent, h } from 'preact';

type Props = { showRules: () => void; showShare: () => void };
const Links: FunctionComponent<Props> = (props) => {
  const handle = (handler: () => void) => (e: MouseEvent) => {
    e.preventDefault();
    handler();
    return false;
  };

  return (
    <div class="links">
      <a href="#" name="Share game to opponent" title="Share" onClick={handle(props.showShare)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <use href="#share" />
        </svg>
      </a>
      <a href="#" name="Show rules" onClick={handle(props.showRules)} title="Rules">
        ?
      </a>
      <a class="github" href="https://github.com/SpiralLogic/hive" title="Visit the source code">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <use href="#github" />
        </svg>
      </a>
    </div>
  );
};

Links.displayName = 'Links';
export default Links;
