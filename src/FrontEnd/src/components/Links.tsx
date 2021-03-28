import '../css/links.css';
import { FunctionComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { AiAction, HiveEvent } from '../services';
import { PlayerId } from '../domain';
import { addHiveDispatchListener, useHiveDispatcher } from '../utilities/dispatcher';
import { getShareUrl } from '../utilities/share';
import { handle } from '../utilities/handlers';
import SVG from './SVG';

type Props = {
  onShowRules: () => void;
  onShowShare: () => void;
  playerId: PlayerId;
};

const Links: FunctionComponent<Props> = (props) => {
  const [useAi, setUseAi] = useState(props.playerId === 0);

  const clickHandler = () => {
    useHiveDispatcher().dispatch<AiAction>({ type: 'toggleAi', newState: !useAi });
    setUseAi(!useAi);
  };

  addHiveDispatchListener<HiveEvent>('opponentConnected', () => {
    setUseAi(false);
  });

  return (
    <div class="links">
      <a href={getShareUrl()} name="Share game to opponent" title="Share" onClick={handle(props.onShowShare)}>
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
