type WindowLocation = typeof window.location;

const oldLocation: WindowLocation = window.location;
export const mockLocation = (location: Partial<WindowLocation>) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  delete window.location;
  window.location = {
    ...oldLocation,
    ...location,
  };

  return (): WindowLocation => (window.location = oldLocation);
};
