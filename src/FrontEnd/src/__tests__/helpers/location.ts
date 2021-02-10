const oldLocation: WindowLocation = window.location;
type WindowLocation = typeof window.location;
export const mockLocation = (location: Partial<WindowLocation>): WindowLocation => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete window.location;
  window.location = {
    ...oldLocation,
    ...location,
  };

  return window.location;
};

export const restoreLocation = (): WindowLocation => (window.location = oldLocation);
