type WindowLocation = typeof globalThis.window.location;

export const mockLocation = (location: Partial<WindowLocation>) => {
  vi.stubGlobal('location', {
    ...globalThis.window.location,
    ...location,
  });

  return () => vi.unstubAllGlobals();
};
