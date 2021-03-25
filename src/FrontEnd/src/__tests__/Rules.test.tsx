import { h } from 'preact';
import { render, screen } from '@testing-library/preact';
import { renderElement } from './test-helpers';
import Rules from '../components/Rules';
import userEvent from '@testing-library/user-event';

describe('Rules tests', () => {
  const renderRules = () => {
    const close = jest.fn();
    const rules = render(<Rules setShowRules={close} />);
    return [rules, close];
  };

  test('next button moves next', () => {
    renderRules();
    userEvent.click(screen.getByTitle('Next'));

    expect(document.querySelector('.selected.queen')).toBeInTheDocument();
  });

  test('prev button goes back to end', () => {
    renderRules();
    userEvent.click(screen.getByTitle('Previous'));

    expect(document.querySelector('.ant')).toBeInTheDocument();
  });

  test('prev button moves back', () => {
    renderRules();
    userEvent.click(screen.getByTitle('Next'));
    userEvent.click(screen.getByTitle('Next'));
    userEvent.click(screen.getByTitle('Previous'));

    expect(document.querySelector('.selected.queen')).toBeInTheDocument();
  });

  test('snapshot', () => {
    expect(renderElement(<Rules setShowRules={() => ({})} />)).toMatchSnapshot();
  });
});
