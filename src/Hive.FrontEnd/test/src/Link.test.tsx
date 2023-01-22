import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import Links from '../../src/components/Links';

import { HiveDispatcher } from '../../src/services';
import { Dispatcher } from '../../src/hooks/useHiveDispatchListener';

const dispatcher = new HiveDispatcher();
vi.spyOn(dispatcher, 'dispatch');

describe('<Links>', () => {
  it(`links toggle Ai off`, async () => {
    render(
      <Dispatcher.Provider value={dispatcher}>
        <Links
          gameId={'123A'}
          currentPlayer={0}
          onShowShare={() => ({})}
          onShowRules={() => ({})}
          aiMode="on"
        />
      </Dispatcher.Provider>
    );

    await userEvent.click(screen.getByTitle(/toggle ai/i));

    expect(dispatcher.dispatch).toHaveBeenLastCalledWith({ newState: 'off', type: 'toggleAi' });
    expect(await screen.findByTitle(/toggle ai/i)).not.toHaveClass('ai-off');
  });

  it(`links toggle Ai off and then back on`, async () => {
    render(
      <Dispatcher.Provider value={dispatcher}>
        <Links
          gameId={'123A'}
          currentPlayer={0}
          onShowShare={() => ({})}
          onShowRules={() => ({})}
          aiMode="off"
        />
      </Dispatcher.Provider>
    );

    await userEvent.click(screen.getByTitle(/toggle ai/i));
    await userEvent.click(screen.getByTitle(/toggle ai/i));

    expect(dispatcher.dispatch).toHaveBeenLastCalledWith({ newState: 'on', type: 'toggleAi' });
    expect(await screen.findByTitle(/toggle ai/i)).toHaveClass('ai-off');
  });

  it('renders', () => {
    expect(
      render(
        <Links
          gameId={'123A'}
          currentPlayer={0}
          onShowShare={() => ({})}
          onShowRules={() => ({})}
          aiMode="on"
        />
      )
    ).toMatchSnapshot();
  });
});
