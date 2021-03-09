import { h } from 'preact';
import { render, screen } from '@testing-library/preact';
import { renderElement } from './helpers';
import Rules from '../components/Rules';
import userEvent from '@testing-library/user-event';

describe('Rules tests', () => {
  test('RuleModal modal calls close', () => {
    const close = jest.fn();
    render(<Rules setShowRules={close} />);
    userEvent.click(screen.getByTitle('Close'));

    expect(close).toBeCalledWith(false);
  });

  test('snapshot', () => {
    expect(renderElement(<Rules setShowRules={() => ({})} />)).toMatchSnapshot();
  });
});
