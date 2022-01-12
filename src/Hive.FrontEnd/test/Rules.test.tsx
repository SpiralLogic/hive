import { ComponentChild } from 'preact';
import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import Rules from '../src/components/Rules';
import { renderElement } from './test-helpers';

describe('<Rules>', () => {
  const renderRules = (): [(ui: ComponentChild) => void, jest.Mock] => {
    const close = jest.fn();
    const { rerender } = render(<Rules />);
    return [rerender, close];
  };

  it('next button moves next', () => {
    const [rerender] = renderRules();
    userEvent.click(screen.getByTitle('Next'));
    rerender(<Rules />);

    expect(screen.getByRole('heading')).toHaveTextContent(/Queen/);
  });

  it('prev button goes back to end', () => {
    const [rerender] = renderRules();
    userEvent.click(screen.getByTitle('Previous'));
    rerender(<Rules />);
    expect(screen.getByRole('heading')).toHaveTextContent(/Freedom To Move/);
  });

  it('prev button moves back', () => {
    const [rerender] = renderRules();
    userEvent.click(screen.getByTitle('Next'));
    userEvent.click(screen.getByTitle('Next'));
    userEvent.click(screen.getByTitle('Previous'));
    rerender(<Rules />);

    expect(screen.getByRole('heading')).toHaveTextContent(/Queen/);
  });

  it('renders', () => {
    expect(renderElement(<Rules />)).toMatchSnapshot();
  });
});
