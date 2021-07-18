import { screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { h } from 'preact';
import Links from '../src/components/Links';
import { useHiveDispatcher } from '../src/utilities/dispatcher';
import { renderElement } from './test-helpers';

describe('links snapshot tests', () => {
  it(`links toggle Ai`, async () => {
    jest.spyOn(useHiveDispatcher(), 'dispatch');
    renderElement(<Links currentPlayer={0} onShowShare={() => ({})} onShowRules={() => ({})} />);
    userEvent.click(screen.getByTitle(/toggle ai/i));
    expect(useHiveDispatcher().dispatch).toHaveBeenCalledWith({ newState: false, type: 'toggleAi' });
    expect(screen.getByTitle(/toggle ai/i)).toHaveClass('ai-off');
  });

  it('snapshot', () => {
    expect(
      renderElement(<Links currentPlayer={0} onShowShare={() => ({})} onShowRules={() => ({})} />)
    ).toMatchSnapshot();
  });
});
