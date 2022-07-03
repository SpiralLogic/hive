import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import Modal from '../../src/components/Modal';

describe('<Modal>', () => {
  let closeSpy: jest.SpyInstance;
  const onCloseSpy = jest.fn();

  beforeEach(() => {
    closeSpy = jest.spyOn(HTMLDialogElement.prototype, 'close');
  });

  it('opens the model by setting prop', () => {
    const { rerender } = render(<Modal isOpen={false} onClose={onCloseSpy} title="test" />);

    rerender(<Modal title="test" isOpen={true} onClose={onCloseSpy} />);

    expect(screen.getByRole('button')).toBeVisible();
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it(`closes when the open attribute is false`, async () => {
    render(<Modal title="test" isOpen={true} onClose={onCloseSpy} />);

    screen.getByRole<HTMLDialogElement>('dialog', { hidden: true }).removeAttribute('open');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it(`renders initially from an opened state`, () => {
    render(<Modal title="test" isOpen={true} onClose={onCloseSpy} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it(`renders initially from an closed state`, () => {
    render(<Modal title="test" isOpen={false} onClose={onCloseSpy} />);
    expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument();
  });

  it('will open and close from props', async () => {
    const { rerender } = render(<Modal title="test" isOpen={true} onClose={onCloseSpy} />);

    expect(screen.getByRole('dialog')).toBeVisible();

    rerender(<Modal title="test" isOpen={false} onClose={onCloseSpy} />);

    expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument();
  });

  it('will close and open from props', async () => {
    const { rerender } = render(<Modal title="test" isOpen={false} onClose={onCloseSpy} />);

    expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument();

    rerender(<Modal title="test" isOpen={true} onClose={onCloseSpy} />);

    expect(screen.getByRole('dialog')).toHaveAttribute('open');
  });

  it(`can click`, async () => {
    render(<Modal title="test" isOpen={true} onClose={onCloseSpy} />);

    await userEvent.click(screen.getByRole('button'));

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it(`doesn't allow multiple interactions during transition`, async () => {
    render(<Modal title="test" isOpen={true} onClose={onCloseSpy} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('open');

    await userEvent.click(screen.getByRole('button'));

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
  });

  it(`fires onClose function`, async () => {
    render(<Modal title="test" isOpen={true} onClose={onCloseSpy} />);

    await userEvent.click(screen.getByRole('button'));

    expect(onCloseSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it(`does default close handler`, async () => {
    render(<Modal title="test" isOpen={true} onClose={onCloseSpy} />);

    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
  });

  it.each([true, false])('renders', (isOpen) => {
    expect(render(<Modal title="test" isOpen={isOpen} onClose={onCloseSpy} />)).toMatchSnapshot();
  });
});
