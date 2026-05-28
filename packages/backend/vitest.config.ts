import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/simple.routes.test.ts'],
    env: {
      DATABASE_PROVIDER: 'sqlite',
    },
  },
});
