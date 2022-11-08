type WindowLocation = typeof window.location;

const oldLocation: WindowLocation = window.location;
export const mockLocation = (location: Partial<WindowLocation>) => {
  Object.defineProperty(window, 'location', {
    value: {
      href: location,
    },
    writable: true,
  });

  window.location = {
    ...oldLocation,
    ...location,
  };

  return (): WindowLocation => (window.location = oldLocation);
};
