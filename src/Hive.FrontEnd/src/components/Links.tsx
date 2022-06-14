import '../css/links.css';

import { FunctionComponent } from 'preact';
import { useContext, useState } from 'preact/hooks';

import { GameId, PlayerId } from '../domain';
import { AiAction, HiveEvent } from '../services';
import { Dispatcher, useHiveDispatchListener } from '../utilities/dispatcher';
import { getShareUrl } from '../utilities/share';
import SVG from './SVG';

type Properties = {
  onShowRules: (value: boolean) => void;
  onShowShare: () => void;
  gameId: GameId;
  currentPlayer: PlayerId;
};
export const handle = (handler: () => void) => (event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
  handler();
  return false;
};

const Links: FunctionComponent<Properties> = ({ gameId, currentPlayer, onShowRules, onShowShare }) => {
  const [useAi, setUseAi] = useState(currentPlayer === 0 ? 'on' : 'off');
  const hiveDispatcher = useContext(Dispatcher);
  const clickHandler = () => {
    const aiMode = useAi === 'on' ? 'off' : 'on';
    hiveDispatcher.dispatch<AiAction>({ type: 'toggleAi', newState: aiMode });
    setUseAi(aiMode);
  };

  useHiveDispatchListener<HiveEvent>('opponentConnected', () => {
    setUseAi('off');
  });

  return (
    <div class="links">
      <a
        href={getShareUrl(gameId, currentPlayer)}
        name="Share game to opponent"
        title="Share"
        onClick={handle(onShowShare)}>
        <SVG>
          <use href="#share" />
        </SVG>
      </a>
      <a href={`/`} name="New game!" title="New Game">
        <SVG>
          <use href="#new" />
        </SVG>
      </a>
      <a href="#" name="Show rules" onClick={() => onShowRules(true)} title="Rules">
        <SVG>
          <use href="#rules" />
        </SVG>
      </a>
      <a
        href="#"
        name="Toggle Ai"
        class={useAi === 'on' ? undefined : 'ai-off'}
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
