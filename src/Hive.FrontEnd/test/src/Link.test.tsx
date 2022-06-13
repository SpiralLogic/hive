import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import Links from '../../src/components/Links';
import { getHiveDispatcher } from '../../src/utilities/dispatcher';

describe('<Links>', () => {
  it(`links toggle Ai off`, async () => {
    jest.spyOn(getHiveDispatcher(), 'dispatch');
    render(<Links gameId={'123A'} currentPlayer={0} onShowShare={() => ({})} onShowRules={() => ({})} />);
    await userEvent.click(screen.getByTitle(/toggle ai/i));
    expect(getHiveDispatcher().dispatch).toHaveBeenLastCalledWith({ newState: 'off', type: 'toggleAi' });
    expect(await screen.findByTitle(/toggle ai/i)).toHaveClass('ai-off');
  });

  it(`links toggle Ai on`, async () => {
    jest.spyOn(getHiveDispatcher(), 'dispatch');
    render(<Links gameId={'123A'} currentPlayer={0} onShowShare={() => ({})} onShowRules={() => ({})} />);
    await userEvent.click(screen.getByTitle(/toggle ai/i));
    await userEvent.click(screen.getByTitle(/toggle ai/i));
    expect(getHiveDispatcher().dispatch).toHaveBeenLastCalledWith({ newState: 'on', type: 'toggleAi' });
    expect(await screen.findByTitle(/toggle ai/i)).not.toHaveClass('ai-off');
  });

  it('renders', () => {
    expect(
      render(<Links gameId={'123A'} currentPlayer={0} onShowShare={() => ({})} onShowRules={() => ({})} />)
    ).toMatchSnapshot();
  });
});
