import { h } from 'preact';
import { render, screen } from '@testing-library/preact';
import PlayerConnected from '../components/PlayerConnected';
import { renderElement } from './test-helpers';

describe('player connected snapshot tests', () => {
  it('show whether the player connected or disconnected', () => {
    const { rerender } = render(<PlayerConnected connected={'connected'} close={() => {}} />);
    expect(screen.getByRole('dialog')).toHaveTextContent(/[^s]connected/);

    rerender(<PlayerConnected connected={'disconnected'} close={() => {}} />);
    expect(screen.getByRole('dialog')).toHaveTextContent(/disconnected/);
  });
  it('snapshot', () => {
    expect(renderElement(<PlayerConnected connected={'disconnected'} close={() => {}} />)).toMatchSnapshot();
  });
});
