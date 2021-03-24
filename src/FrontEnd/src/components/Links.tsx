import '../css/links.css';
import { AiAction, HiveEvent } from '../services';
import { FunctionComponent, h } from 'preact';
import { addHiveDispatchListener, useHiveDispatcher } from '../utilities/hooks';
import { useState } from 'preact/hooks';
import SVG from './SVG';

type Props = {
  shareUrl: string;
  onShowRules: () => void;
  onShowShare: () => void;
};
const handle = (handler: () => void) => (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  handler();
  return false;
};

const Links: FunctionComponent<Props> = (props) => {
  const [useAi, setUseAi] = useState(true);

  const clickHandler = () => {
    useHiveDispatcher().dispatch<AiAction>({ type: 'toggleAi', newState: !useAi });
    setUseAi(!useAi);
  };

  addHiveDispatchListener<HiveEvent>('opponentConnected', () => {
    setUseAi(false);
  });

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
        onClick={handle(clickHandler)}
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
