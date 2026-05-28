import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: [],
    env: {
      DATABASE_PROVIDER: 'sqlite',
    },
  },
});
