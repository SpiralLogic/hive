import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import Modal from '../../src/components/Modal';
import { renderElement } from '../helpers';

describe('<Modal>', () => {
  let showModalSpy: jest.SpyInstance, closeSpy: jest.SpyInstance;

  beforeEach(() => {
    showModalSpy = jest.spyOn(HTMLDialogElement.prototype, 'showModal');
    closeSpy = jest.spyOn(HTMLDialogElement.prototype, 'close');
  });

  it('closes the modal by clicking the close button', () => {
    const onClose = jest.fn();

    const { rerender } = render(<Modal title="test" class="test" onClose={onClose} />);

    rerender(<Modal title="test" isOpen={true} class="test" onClose={onClose} />);
    expect(screen.getByRole('button')).toBeVisible();

    expect(showModalSpy).toHaveBeenCalledTimes(1);
  });

  it(`opens the modal only when it is closed`, () => {
    const { rerender } = render(<Modal title="test" isOpen={false} class="test" />);

    rerender(<Modal title="test" isOpen={true} class="test" />);
    rerender(<Modal title="test" isOpen={true} class="test" />);

    expect(showModalSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it(`renders initially from an opened state`, () => {
    const onClose = jest.fn();

    render(<Modal title="test" isOpen={true} class="test" onClose={onClose} />);

    expect(closeSpy).toHaveBeenCalledTimes(0);
    expect(showModalSpy).toHaveBeenCalledTimes(0);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it(`renders initially from an closed state`, () => {
    render(<Modal title="test" isOpen={false} class="test" onClose={jest.fn()} />);

    expect(closeSpy).toHaveBeenCalledTimes(0);
    expect(showModalSpy).toHaveBeenCalledTimes(0);
    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
  });

  it('will open and close from props', async () => {
    const { rerender } = render(<Modal title="test" isOpen={true} class="test" onClose={jest.fn()} />);

    expect(screen.getByRole('dialog')).toHaveAttribute('open');
    expect(showModalSpy).toHaveBeenCalledTimes(0);

    rerender(<Modal title="test" isOpen={false} class="test" onClose={jest.fn()} />);

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
  });

  it('will close and open from props', async () => {
    const { rerender } = render(<Modal title="test" isOpen={false} class="test" onClose={jest.fn()} />);

    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
    expect(closeSpy).toHaveBeenCalledTimes(0);

    rerender(<Modal title="test" isOpen={true} class="test" onClose={jest.fn()} />);

    expect(screen.getByRole('dialog')).toHaveAttribute('open');
    expect(showModalSpy).toHaveBeenCalledTimes(1);
  });

  it(`can click`, async () => {
    render(<Modal title="test" isOpen={true} class="test" onClose={jest.fn()} />);

    await userEvent.click(screen.getByRole('button'));

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
  });

  it(`doesn't allow multiple interactions during transition`, async () => {
    render(<Modal title="test" isOpen={true} class="test" onClose={jest.fn()} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('open');

    await userEvent.click(screen.getByRole('button'));

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
  });

  it(`fires onClose function`, async () => {
    const onCloseSpy = jest.fn();
    render(<Modal title="test" isOpen={true} class="test" onClose={onCloseSpy} />);

    await userEvent.click(screen.getByRole('button'));
    expect(onCloseSpy).toHaveBeenCalledTimes(1);
  });

  it(`does default close handler`, async () => {
    render(<Modal title="test" isOpen={true} class="test" />);

    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
  });

  it.each([true, false])('renders', (isOpen) => {
    expect(renderElement(<Modal title="test" isOpen={isOpen} class="test" />)).toMatchSnapshot();
  });
});
