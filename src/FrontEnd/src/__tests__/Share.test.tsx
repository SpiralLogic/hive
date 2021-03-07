import { h } from 'preact';
import { mockClipboard, mockExecCommand, mockShare } from './helpers/clipboard';
import { render, screen } from '@testing-library/preact';
import { renderElement } from './helpers';
import Share from '../components/Share';

describe('Share tests', () => {
  test('if available share API is called', () => {
    const restore = mockShare();
    render(<Share setShowShare={() => ({})} />);
    expect(navigator.share).toBeCalledWith(expect.objectContaining({ url: expect.stringMatching(/.*1$/) }));
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

  describe('Share snapshot tests', () => {
    test('snapshot', () => {
      expect(renderElement(<Share setShowShare={() => ({})} />)).toMatchSnapshot();
    });
  });
});
