export const mockClipboard = () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal('navigator', { clipboard: { writeText } });
 return    writeText
};

export const mockShare = () => {
  const share = vi.fn();
  vi.stubGlobal('navigator', { share });
  return share
};

export const noShare = () => {
  vi.stubGlobal('navigator', { share: undefined });
};
