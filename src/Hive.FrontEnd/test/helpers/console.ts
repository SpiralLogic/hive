export function mockConsole() {
  const console = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };

  vi.stubGlobal('console', console);
}
