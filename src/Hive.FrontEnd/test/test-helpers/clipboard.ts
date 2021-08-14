import MockedFunction = jest.MockedFunction;

export const mockClipboard = (function_: MockedFunction<any>) => {
  const clipboard = navigator.clipboard;
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: function_,
    },
    configurable: true,
    writable: true,
  });
  return () => {
    Object.defineProperty(navigator, 'clipboard', { value: clipboard });
  };
};

export const mockExecCommand = (function_: MockedFunction<() => void>) => {
  Object.defineProperty(document, 'execCommand', {
    value: function_,
    configurable: true,
    writable: true,
  });

  return () => {
    Object.defineProperty(document, 'execCommand', { value: undefined });
  };
};

export const mockShare = (function_: MockedFunction<any>) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method,jest/unbound-method
  const share = navigator.share;
  Object.defineProperty(navigator, 'share', {
    value: function_,
    configurable: true,
    writable: true,
  });
  return () => {
    Object.defineProperty(navigator, 'share', { value: share });
  };
};

export const noShare = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method,jest/unbound-method
  const share = navigator.share;
  Object.defineProperty(navigator, 'share', { value: undefined });
  return (): void => {
    Object.defineProperty(navigator, 'share', { value: share });
  };
};
