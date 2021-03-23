import '../css/links.css';
import { FunctionComponent, h } from 'preact';
import SVG from './SVG';

type Props = {
  shareUrl: string;
  onShowRules: () => void;
  onShowShare: () => void;
  aiState: [boolean, (on: boolean) => void];
};

const Links: FunctionComponent<Props> = (props) => {
  const handle = (handler: () => void) => (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handler();
    return false;
  };
  const [useAi, setUseAi] = props.aiState;
  return (
    <div class="links">
      <a
        href={props.shareUrl}
        name="Share game to opponent"
        title="Share"
        onClick={handle(props.onShowShare)}>
        <SVG>
          <use href="#share" />
        </SVG>
      </a>
      <a href={`/${location.search}`} name="New game!" title="New Game">
        <SVG>
          <use href="#new" />
        </SVG>
      </a>
      <a href="#" name="Show rules" onClick={handle(props.onShowRules)} title="Rules">
        ?
      </a>
      <a
        href="#"
        name="Toggle Ai"
        class={useAi ? undefined : 'ai-off'}
        onClick={handle(() => setUseAi(!useAi))}
        title="Toggle Ai">
        <SVG>
          <use href="#ai" />
        </SVG>
      </a>
      <a class="github" href="https://github.com/SpiralLogic/hive" title="Source code">
        <SVG>
          <use href="#github" />
        </SVG>
      </a>
    </div>
  );
};

Links.displayName = 'Links';
export default Links;
