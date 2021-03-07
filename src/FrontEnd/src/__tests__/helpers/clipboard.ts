export const mockClipboard = () => {
  const clipboard = navigator.clipboard;
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: jest.fn().mockResolvedValue(undefined),
    },
    configurable: true,
    writable: true,
  });
  return (): void =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Object.defineProperty(navigator, 'clipboard', { value: clipboard });
};

export const mockExecCommand = () => {
  const execCommand = document.execCommand;
  Object.defineProperty(document, 'execCommand', {
    value: jest.fn(),
    configurable: true,
    writable: true,
  });

  return () => null;
};

export const mockShare = () => {
  const share = navigator.share;
  Object.defineProperty(navigator, 'share', {
    value: jest.fn().mockResolvedValue(undefined),
    configurable: true,
    writable: true,
  });
  return (): void =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Object.defineProperty(navigator, 'share', { value: share });
};
