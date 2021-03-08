import { h } from 'preact';
import { mockClipboard, mockExecCommand, mockShare } from './helpers/clipboard';
import { render, screen } from '@testing-library/preact';
import { renderElement } from './helpers';
import Share from '../components/Share';
import userEvent from '@testing-library/user-event';

describe('Share tests', () => {
  test('No share possible', () => {
    render(<Share setShowShare={() => ({})} />);
    expect(screen.queryAllByRole('dialog')).toHaveLength(0);
  });

  test('if available share API is called', () => {
    const restore = mockShare();
    render(<Share setShowShare={() => ({})} />);
    expect(navigator.share).toBeCalledWith(expect.objectContaining({ url: expect.stringMatching(/.*1$/) }));
    restore();
  });

  test('share API is called for opponent', () => {
    global.window.history.replaceState({}, global.document.title, `/game/33/1`);
    const restore = mockShare();
    render(<Share setShowShare={() => ({})} />);
    expect(navigator.share).toBeCalledWith(expect.objectContaining({ url: expect.stringMatching(/.*0$/) }));
    global.window.history.replaceState({}, global.document.title, `/game/33/0`);
    restore();
  });

  test('Click copies opponent link to clipboard with navigator', () => {
    const restore = mockClipboard();
    render(<Share setShowShare={() => ({})} />);
    expect(navigator.clipboard.writeText).toBeCalledWith(expect.stringMatching(/.*1$/));
    restore();
  });

  test('Click copies opponent link to clipboard with exec command', () => {
    const restore = mockExecCommand();
    render(<Share setShowShare={() => ({})} />);
    expect(document.execCommand).toBeCalledWith('copy');
    restore();
  });

  test('Share modal calls close', () => {
    const restore = mockExecCommand();
    const close = jest.fn();
    render(<Share setShowShare={close} />);
    userEvent.click(screen.getByRole('button'));

    expect(close).toBeCalledWith(false);
    restore();
  });

  describe('Share snapshot tests', () => {
    test('snapshot', () => {
      expect(renderElement(<Share setShowShare={() => ({})} />)).toMatchSnapshot();
    });
  });
});
