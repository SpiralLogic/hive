type WindowLocation = typeof window.location;

export const mockLocation = (location: Partial<WindowLocation>) => {
  vi.stubGlobal('location', {
    ...global.window.location,
    ...location,
  });

  return () => vi.unstubAllGlobals();
};
