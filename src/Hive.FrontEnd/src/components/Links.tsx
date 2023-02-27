import '../css/links.css';

import { FunctionComponent } from 'preact';
import { GameId, PlayerId } from '../domain';
import { getShareUrl } from '../utilities/share';
import { AiMode } from '../domain/engine';
import SVG from './SVG';
import { Signal, useComputed } from '@preact/signals';

type Properties = {
  onShowRules: () => void;
  onShowShare: () => void;
  gameId: Signal<GameId>;
  aiMode: Signal<AiMode>;
  currentPlayer: PlayerId;
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
        <SVG hrefs={['share']} />
      </a>
      <a href={`/`} name="New game!" title="New Game">
        <SVG hrefs={['new']} />
      </a>
      <a href="#" name="Show rules" onClick={handle(onShowRules)} title="Rules">
        <SVG hrefs={['rules']} />
      </a>
      <a
        href="#"
        name="Toggle Ai"
        class={aiClass}
        onWheel={handle(wheelHandler)}
        onClick={handle(clickHandler)}
        title="Toggle Ai">
        <SVG hrefs={['ai']} />
      </a>
      <a class="github" href="https://github.com/SpiralLogic/hive" title="Source code">
        <SVG hrefs={['github']} />
      </a>
    </nav>
  );
};

Links.displayName = 'Links';
export default Links;
