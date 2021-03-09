import { h } from 'preact';
import { mockClipboard, mockExecCommand, mockShare } from './helpers/clipboard';
import { render, screen } from '@testing-library/preact';
import { renderElement } from './helpers';
import Share from '../components/Share';
import userEvent from '@testing-library/user-event';

describe('Share tests', () => {
  test('No share possible', () => {
    render(<Share url={`/game/33/1`} setShowShare={() => ({})} />);
    expect(screen.queryAllByRole('dialog')).toHaveLength(0);
  });

  test('if available share API is called', () => {
    const restore = mockShare();
    const url = `/game/33/1`;
    render(<Share url={url} setShowShare={() => ({})} />);
    expect(navigator.share).toBeCalledWith(expect.objectContaining({ url }));
    restore();
  });

  test('Click copies opponent link to clipboard with navigator', () => {
    const restore = mockClipboard();
    const url = `/game/33/1`;
    render(<Share url={url} setShowShare={() => ({})} />);
    expect(navigator.clipboard.writeText).toBeCalledWith(url);
    restore();
  });

  test('Click copies opponent link to clipboard with exec command', () => {
    const restore = mockExecCommand();
    render(<Share url={`/game/33/1`} setShowShare={() => ({})} />);
    expect(document.execCommand).toBeCalledWith('copy');
    restore();
  });

  test('Share modal calls close', () => {
    const restore = mockExecCommand();
    const close = jest.fn();
    render(<Share url={`/game/33/1`} setShowShare={close} />);
    userEvent.click(screen.getByRole('button'));

    expect(close).toBeCalledWith(false);
    restore();
  });

  describe('Share snapshot tests', () => {
    test('snapshot', () => {
      expect(renderElement(<Share url={`/game/33/1`} setShowShare={() => ({})} />)).toMatchSnapshot();
    });
  });
});
