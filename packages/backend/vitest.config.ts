import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    env: {
      DATABASE_PROVIDER: 'sqlite',
      JWT_SECRET: 'desarrollo_secreto_local_minamatch',
    },
  },
});
