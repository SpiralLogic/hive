import { fileURLToPath } from 'url';
import { resolve } from 'pathe';
import sirv from 'sirv';

var index = (base = "/__vitest__/") => {
  return {
    name: "vitest:ui",
    apply: "serve",
    async configureServer(server) {
      const clientDist = resolve(fileURLToPath(import.meta.url), "../client");
      server.middlewares.use(base, sirv(clientDist, {
        single: true,
        dev: true
      }));
    }
  };
};

export { index as default };
