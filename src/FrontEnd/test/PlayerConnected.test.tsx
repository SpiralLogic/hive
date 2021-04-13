import { h } from 'preact';
import { render, screen } from '@testing-library/preact';
import PlayerConnected from '../src/components/PlayerConnected';
import { renderElement } from './test-helpers';

describe('player connected snapshot tests', () => {
  it('show whether the player connected or disconnected', () => {
    const { rerender } = render(<PlayerConnected connected={'connected'} />);
    expect(screen.getByText(/[^s]connected/)).toBeInTheDocument();

    rerender(<PlayerConnected connected={'disconnected'} />);
    expect(screen.getByText(/disconnected/)).toBeInTheDocument();
  });
  it('snapshot', () => {
    expect(renderElement(<PlayerConnected connected={'disconnected'} />)).toMatchSnapshot();
  });
});
