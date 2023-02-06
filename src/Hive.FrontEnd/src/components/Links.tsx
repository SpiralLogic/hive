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
  gameId: GameId;
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
      aiMode.value = aiMode.value === 'on' ? 'off' : 'on';
    };
    const aiClass = useComputed(() => (aiMode.value === 'on' ? undefined : 'ai-off'));
    return (
      <nav>
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
        <a href="#" name="Show rules" onClick={handle(onShowRules)} title="Rules">
          <SVG>
            <use href="#rules" />
          </SVG>
        </a>
        <a href="#" name="Toggle Ai" class={aiClass} onClick={handle(clickHandler)} title="Toggle Ai">
          <SVG>
            <use href="#ai" />
          </SVG>
        </a>
        <a class="github" href="https://github.com/SpiralLogic/hive" title="Source code">
          <SVG>
            <use href="#github" />
          </SVG>
        </a>
      </nav>
    );
};

Links.displayName = 'Links';
export default Links;
