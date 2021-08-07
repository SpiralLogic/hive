import '../css/links.css';

import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';

import { PlayerId } from '../domain';
import { AiAction, HiveEvent } from '../services';
import { addHiveDispatchListener, useHiveDispatcher } from '../utilities/dispatcher';
import { getShareUrl } from '../utilities/share';
import SVG from './SVG';

type Props = {
  onShowRules: (value: boolean) => void;
  onShowShare: () => void;
  currentPlayer: PlayerId;
};
export const handle = (handler: () => void) => (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  handler();
  return false;
};

const Links: FunctionComponent<Props> = (props) => {
  const [useAi, setUseAi] = useState(props.currentPlayer === 0);

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
        href={getShareUrl(props.currentPlayer)}
        name="Share game to opponent"
        title="Share"
        onClick={handle(props.onShowShare)}>
        <SVG>
          <use href="#share" />
        </SVG>
      </a>
      <a href={`/`} name="New game!" title="New Game">
        <SVG>
          <use href="#new" />
        </SVG>
      </a>
      <a href="#" name="Show rules" onClick={() => props.onShowRules(true)} title="Rules">
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
