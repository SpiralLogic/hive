export const mockClipboard = () => {
  const clipboard = navigator.clipboard;
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: jest.fn().mockResolvedValue(undefined),
    },
    configurable: true,
    writable: true,
  });
  return (): void => Object.defineProperty(navigator, 'clipboard', { value: clipboard });
};

export const mockExecCommand = () => {
  Object.defineProperty(document, 'execCommand', {
    value: jest.fn(),
    configurable: true,
    writable: true,
  });

  return (): void => Object.defineProperty(document, 'execCommand', { value: undefined });
};

export const mockShare = () => {
  // eslint-disable-next-line jest/unbound-method
  const share = navigator.share;
  Object.defineProperty(navigator, 'share', {
    value: jest.fn().mockResolvedValue(undefined),
    configurable: true,
    writable: true,
  });
  return (): void => Object.defineProperty(navigator, 'share', { value: share });
};

export const noShare = () => {
  // eslint-disable-next-line jest/unbound-method
  const share = navigator.share;
  Object.defineProperty(navigator, 'share', { value: undefined });
  return (): void => {
    Object.defineProperty(navigator, 'share', { value: share });
  };
};
