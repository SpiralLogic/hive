import { screen } from '@testing-library/preact';
import { GameState } from '@hive/domain';
import { appSetup } from './utilities/App.setup.tsx';

describe('aa', () => {
  it('shows loading', () => {
    const ab = new AbortController();
    const promise = new Promise<GameState>((resolve) => {
      ab.signal.addEventListener('abort', () => resolve(undefined));
    });
    appSetup(promise);
    expect(screen.getByText(/loading/)).toBeInTheDocument();
    ab.abort();
  });

  it('shows broken loading', async () => {
    appSetup(Promise.reject(new Error('broken loading')));

    expect(await screen.findByRole('heading', { name: /broken loading/ })).toBeInTheDocument();
  });
});
