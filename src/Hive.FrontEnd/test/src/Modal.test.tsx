import { signal } from '@preact/signals';
import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import Modal from '../../src/components/Modal';

const closeSpy = vi.spyOn(HTMLDialogElement.prototype, 'close');
const onCloseSpy = vi.fn();

describe('<Modal>', () => {
  it('opens the model by toggling signal', () => {
    const isOpen = signal(false);
    render(<Modal open={isOpen} onClose={onCloseSpy} title="test" />);

    isOpen.value = true;

    expect(screen.getByRole('button')).toBeVisible();
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it(`closes when the close method is called`, async () => {
    render(<Modal title="test" open={signal(true)} onClose={onCloseSpy} />);

    screen.getByRole<HTMLDialogElement>('dialog', { hidden: true }).close();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it(`renders initially from an opened state`, () => {
    render(<Modal title="test" open={signal(true)} onClose={onCloseSpy} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it(`renders initially from a closed state`, () => {
    const { rerender } = render(<Modal title="test" open={signal(false)} onClose={onCloseSpy} />);

    expect(screen.getByRole('dialog', { hidden: true })).not.toBeVisible();

    rerender(<Modal title="test" open={signal(true)} onClose={onCloseSpy} />);

    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it(`can click`, async () => {
    render(<Modal title="test" open={signal(true)} onClose={onCloseSpy} />);

    await userEvent.click(screen.getByRole('button'));

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it(`doesn't allow multiple interactions during transition`, async () => {
    render(<Modal title="test" open={signal(true)} onClose={onCloseSpy} />);

    expect(screen.getByRole('dialog')).toHaveAttribute('open');

    await userEvent.click(screen.getByRole('button'));

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
  });

  it(`fires onClose function`, async () => {
    render(<Modal title="test" open={signal(true)} onClose={onCloseSpy} />);

    await userEvent.click(screen.getByRole('button'));

    expect(onCloseSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it(`does default close handler`, async () => {
    render(<Modal title="test" open={signal(true)} onClose={onCloseSpy} />);

    await userEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
  });
});

describe('<Modal> snapshots', () => {
  it('matches', () => {
    expect(render(<Modal title="test" open={signal(true)} onClose={onCloseSpy} />)).toMatchSnapshot();
  });
});
