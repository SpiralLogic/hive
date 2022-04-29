import { render, screen } from '@testing-library/preact';
import PlayerConnected from '../../src/components/PlayerConnected';

describe('<PlayerConnected>', () => {
  it('show whether the player connected or disconnected', () => {
    const { rerender } = render(<PlayerConnected connected={'connected'} />);
    expect(screen.getByText(/[^s]connected/)).toBeInTheDocument();

    rerender(<PlayerConnected connected={'disconnected'} />);
    expect(screen.getByText(/disconnected/)).toBeInTheDocument();
  });
  it('renders', () => {
    expect(render(<PlayerConnected connected={'disconnected'} />)).toMatchSnapshot();
  });
});
