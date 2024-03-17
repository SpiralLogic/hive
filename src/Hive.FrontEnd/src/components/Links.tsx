import '../css/links.css';

import { FunctionComponent } from 'preact';
import { getShareUrl } from '../utilities/share';
import { AiMode } from '../domain/engine';
import Svg from './Svg.tsx';
import { Signal, useComputed } from '@preact/signals';

type Properties = {
  onShowRules: () => void;
  onShowShare: () => void;
  gameId: Signal<string>;
  aiMode: Signal<AiMode>;
  currentPlayer: number;
};

const handle = (handler: () => void) => {
  return (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    handler();
  };
};

const Links: FunctionComponent<Properties> = ({
  gameId,
  currentPlayer,
  onShowRules,
  onShowShare,
  aiMode,
}) => {
  const clickHandler = () => {
    aiMode.value = aiMode.value !== 'off' ? 'off' : 'on';
  };
  const wheelHandler = () => {
    aiMode.value = 'auto';
  };

  const aiClass = useComputed(() => (aiMode.value !== 'off' ? undefined : 'ai-off'));
  return (
    <nav>
      <a
        href={getShareUrl(gameId.value, currentPlayer)}
        name="Share game to opponent"
        title="Share"
        onClick={handle(onShowShare)}>
        <Svg hrefs={['share']} />
      </a>
      <a href={`/`} name="New game!" title="New Game">
        <Svg hrefs={['new']} />
      </a>
      <button name="Show rules" onClick={handle(onShowRules)} title="Rules">
        <Svg hrefs={['rules']} />
      </button>
      <button
        name="Toggle Ai"
        class={aiClass}
        onWheel={handle(wheelHandler)}
        onDblClick={handle(wheelHandler)}
        onClick={handle(clickHandler)}
        title="Toggle Ai">
        <Svg hrefs={['ai']} />
      </button>
      <a class="github" href="https://github.com/SpiralLogic/hive" title="Source code">
        <Svg hrefs={['github']} />
      </a>
    </nav>
  );
};

Links.displayName = 'Links';
export default Links;
