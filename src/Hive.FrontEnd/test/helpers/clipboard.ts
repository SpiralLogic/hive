export const mockClipboard = () => {
  const clipboard = navigator.clipboard;
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal('navigator', { clipboard: { writeText } });
  return [
    () => {
      Object.defineProperty(navigator, 'clipboard', { value: clipboard });
      vi.unstubAllGlobals();
    },
    writeText,
  ];
};

export const mockShare = () => {
  const share = vi.fn();
  vi.stubGlobal('navigator', { share });
  return [
    () => {
      vi.unstubAllGlobals();
    },
    share,
  ];
};

export const noShare = () => {
  vi.stubGlobal('navigator', { share: undefined });
  return [
    (): void => {
      vi.unstubAllGlobals();
    },
  ];
};
