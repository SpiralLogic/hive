import { h } from 'preact';
import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import Rules from '../components/Rules';
import { renderElement } from './test-helpers';

describe('rules tests', () => {
  const renderRules = () => {
    const close = jest.fn();
    const rules = render(<Rules setShowRules={close} />);
    return [rules, close];
  };

  it('next button moves next', () => {
    renderRules();
    userEvent.click(screen.getByTitle('Next'));

    expect(document.querySelector('.selected.queen')).toBeInTheDocument();
  });

  it('prev button goes back to end', () => {
    renderRules();
    userEvent.click(screen.getByTitle('Previous'));

    expect(document.querySelector('.ant')).toBeInTheDocument();
  });

  it('prev button moves back', () => {
    renderRules();
    userEvent.click(screen.getByTitle('Next'));
    userEvent.click(screen.getByTitle('Next'));
    userEvent.click(screen.getByTitle('Previous'));

    expect(document.querySelector('.selected.queen')).toBeInTheDocument();
  });

  it('snapshot', () => {
    expect(renderElement(<Rules setShowRules={() => ({})} />)).toMatchSnapshot();
  });
});
