import '../css/links.css';

import { FunctionComponent, h } from 'preact';
import { useState } from 'preact/hooks';

import { PlayerId } from '../domain';
import { AiAction, HiveEvent } from '../services';
import { getHiveDispatcher, useHiveDispatchListener } from '../utilities/dispatcher';
import { getShareUrl } from '../utilities/share';
import SVG from './SVG';

type Properties = {
  onShowRules: (value: boolean) => void;
  onShowShare: () => void;
  currentPlayer: PlayerId;
};
export const handle = (handler: () => void) => (event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
  handler();
  return false;
};

const Links: FunctionComponent<Properties> = (properties) => {
  const [useAi, setUseAi] = useState(properties.currentPlayer === 0);
  const hiveDispatcher = getHiveDispatcher();
  const clickHandler = () => {
    hiveDispatcher.dispatch<AiAction>({ type: 'toggleAi', newState: !useAi });
    setUseAi(!useAi);
  };

  useHiveDispatchListener<HiveEvent>('opponentConnected', () => {
    setUseAi(false);
  });

  return (
    <div class="links">
      <a
        href={getShareUrl(properties.currentPlayer)}
        name="Share game to opponent"
        title="Share"
        onClick={handle(properties.onShowShare)}>
        <SVG>
          <use href="#share" />
        </SVG>
      </a>
      <a href={`/`} name="New game!" title="New Game">
        <SVG>
          <use href="#new" />
        </SVG>
      </a>
      <a href="#" name="Show rules" onClick={() => properties.onShowRules(true)} title="Rules">
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
