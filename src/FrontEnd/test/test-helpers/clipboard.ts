import MockedFunction = jest.MockedFunction;

export const mockClipboard = (fn: MockedFunction<() => Promise<undefined>>) => {
  const clipboard = navigator.clipboard;
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: fn.mockResolvedValue(undefined),
    },
    configurable: true,
    writable: true,
  });
  return (): Navigator => Object.defineProperty(navigator, 'clipboard', { value: clipboard });
};

export const mockExecCommand = (fn: MockedFunction<() => void>) => {
  Object.defineProperty(document, 'execCommand', {
    value: fn,
    configurable: true,
    writable: true,
  });

  return (): Document => Object.defineProperty(document, 'execCommand', { value: undefined });
};

export const mockShare = (fn: MockedFunction<() => Promise<undefined>>) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method,jest/unbound-method
  const share = navigator.share;
  Object.defineProperty(navigator, 'share', {
    value: fn.mockResolvedValue(undefined),
    configurable: true,
    writable: true,
  });
  return (): Navigator => Object.defineProperty(navigator, 'share', { value: share });
};

export const noShare = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method,jest/unbound-method
  const share = navigator.share;
  Object.defineProperty(navigator, 'share', { value: undefined });
  return (): void => {
    Object.defineProperty(navigator, 'share', { value: share });
  };
};
