import { screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import Links from '../src/components/Links';
import { getHiveDispatcher } from '../src/utilities/dispatcher';
import { renderElement } from './test-helpers';

describe('<Links>', () => {
  it(`links toggle Ai`, async () => {
    jest.spyOn(getHiveDispatcher(), 'dispatch');
    renderElement(
      <Links gameId={'123A'} currentPlayer={0} onShowShare={() => ({})} onShowRules={() => ({})} />
    );
    userEvent.click(screen.getByTitle(/toggle ai/i));
    expect(getHiveDispatcher().dispatch).toHaveBeenCalledWith({ newState: false, type: 'toggleAi' });
    expect(await screen.findByTitle(/toggle ai/i)).toHaveClass('ai-off');
  });

  it('snapshot', () => {
    expect(
      renderElement(
        <Links gameId={'123A'} currentPlayer={0} onShowShare={() => ({})} onShowRules={() => ({})} />
      )
    ).toMatchSnapshot();
  });
});
