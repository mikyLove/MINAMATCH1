import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/simple.routes.postgres.test.ts'],
    env: {
      DATABASE_PROVIDER: 'postgres',
      DATABASE_URL: 'postgres://minamatch:minamatch_dev@localhost:5432/minamatch_v2',
      JWT_SECRET: 'desarrollo_secreto_local_minamatch',
    },
  },
});
