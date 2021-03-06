import { FunctionComponent, h } from 'preact';

type Props = { setShowHelp: (value: boolean) => void };
const Links: FunctionComponent<Props> = (props) => {
  const { setShowHelp } = props;
  const handleOnClick = () => {
    setShowHelp(false);
    return false;
  };
  return (
    <div class="links">
      <a class="help" href="#" name="Show rules" onClick={handleOnClick} title="Rules">
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
