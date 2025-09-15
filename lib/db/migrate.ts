import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

config({
  path: '.env.local',
});

const runMigrate = async () => {
  const postgresUrl = process.env.POSTGRES_URL;

  // If no Postgres URL is defined (e.g. on first deploy or Vercel preview),
  // skip running migrations.
  if (!postgresUrl) {
    console.log('POSTGRES_URL is not defined, skipping migrations');
    return;
  }

  const connection = postgres(postgresUrl, { max: 1 });
  const db = drizzle(connection);

  console.log('\u23F1 Running migrations...');

  const start = Date.now();
  await migrate(db, { migrationsFolder: './lib/db/migrations' });
  const end = Date.now();

  console.log('\u2705 Migrations completed in', end - start, 'ms');
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error('\u274C Migration failed');
  console.error(err);
  process.exit(1);
});
