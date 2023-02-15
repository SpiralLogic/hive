import { fireEvent, render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import Links from '../../src/components/Links';

import { HiveDispatcher } from '../../src/services';
import { Dispatcher } from '../../src/hooks/useHiveDispatchListener';
import { signal } from '@preact/signals';
import { AiMode } from '../../src/domain/engine';

const dispatcher = new HiveDispatcher();
vi.spyOn(dispatcher, 'dispatch');

describe('<Links>', () => {
  it(`links toggle Ai off`, async () => {
    const aiMode = signal<AiMode>('on');
    render(
      <Dispatcher.Provider value={dispatcher}>
        <Links
          gameId={signal('123A')}
          currentPlayer={0}
          onShowShare={() => ({})}
          onShowRules={() => ({})}
          aiMode={aiMode}
        />
      </Dispatcher.Provider>
    );

    await userEvent.click(screen.getByTitle(/toggle ai/i));

    expect(aiMode.value).toBe('off');
    expect(await screen.findByTitle(/toggle ai/i)).toHaveClass('ai-off');
  });

  it(`links toggle Ai off and then back on`, async () => {
    const aiMode = signal<AiMode>('off');
    render(
      <Dispatcher.Provider value={dispatcher}>
        <Links
          gameId={signal('123A')}
          currentPlayer={0}
          onShowShare={() => ({})}
          onShowRules={() => ({})}
          aiMode={aiMode}
        />
      </Dispatcher.Provider>
    );

    await userEvent.click(screen.getByTitle(/toggle ai/i));
    expect(aiMode.value).toBe('on');

    await userEvent.click(screen.getByTitle(/toggle ai/i));

    expect(aiMode.value).toBe('off');
    expect(await screen.findByTitle(/toggle ai/i)).toHaveClass('ai-off');
  });

  it(`mouse wheel toggles Ai on`, async () => {
    const aiMode = signal<AiMode>('off');
    render(
      <Dispatcher.Provider value={dispatcher}>
        <Links
          gameId={signal('123A')}
          currentPlayer={0}
          onShowShare={() => ({})}
          onShowRules={() => ({})}
          aiMode={aiMode}
        />
      </Dispatcher.Provider>
    );

    fireEvent.wheel(screen.getByTitle(/toggle ai/i));

    expect(aiMode.value).toBe('auto');
    expect(await screen.findByTitle(/toggle ai/i)).not.toHaveClass('ai-off');
  });

  it(`click toggles auto Ai off`, async () => {
    const aiMode = signal<AiMode>('auto');
    render(
      <Dispatcher.Provider value={dispatcher}>
        <Links
          gameId={signal('123A')}
          currentPlayer={0}
          onShowShare={() => ({})}
          onShowRules={() => ({})}
          aiMode={aiMode}
        />
      </Dispatcher.Provider>
    );

    await userEvent.click(screen.getByTitle(/toggle ai/i));

    expect(aiMode.value).toBe('off');
    expect(await screen.findByTitle(/toggle ai/i)).toHaveClass('ai-off');
  });

  it('renders', () => {
    expect(
      render(
        <Links
          gameId={signal('123A')}
          currentPlayer={0}
          onShowShare={() => ({})}
          onShowRules={() => ({})}
          aiMode={signal('on')}
        />
      )
    ).toMatchSnapshot();
  });
});
