import { h } from 'preact';
import { render, RenderResult, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import Rules from '../components/Rules';
import { renderElement } from './test-helpers';

describe('rules tests', () => {
  const renderRules = (): [RenderResult, jest.Mock] => {
    const close = jest.fn();
    const rules = render(<Rules />);
    return [rules, close];
  };

  it('next button moves next', () => {
    const [rules] = renderRules();
    userEvent.click(screen.getByTitle('Next'));
    rules.rerender(<Rules />);

    expect(document.querySelector('.selected.queen')).toBeInTheDocument();
  });

  it('prev button goes back to end', () => {
    const [rules] = renderRules();
    userEvent.click(screen.getByTitle('Previous'));
    rules.rerender(<Rules />);
    expect(document.querySelector('.ant')).toBeInTheDocument();
  });

  it('prev button moves back', () => {
    const [rules] = renderRules();
    userEvent.click(screen.getByTitle('Next'));
    userEvent.click(screen.getByTitle('Next'));
    userEvent.click(screen.getByTitle('Previous'));
    rules.rerender(<Rules />);

    expect(document.querySelector('.selected.queen')).toBeInTheDocument();
  });

  it('snapshot', () => {
    expect(renderElement(<Rules />)).toMatchSnapshot();
  });
});
