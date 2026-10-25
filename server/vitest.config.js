import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: {
      // Keep the test MongoDB binary inside the project instead of the user's home folder.
      MONGOMS_DOWNLOAD_DIR: fileURLToPath(
        new URL('../node_modules/.cache/mongodb-memory-server', import.meta.url),
      ),
    },
    // Starting an in-memory MongoDB replica set can take a while on the first run.
    hookTimeout: 120_000,
    testTimeout: 30_000,
  },
});
