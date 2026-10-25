import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { loadEnv } from './config/env.js';

const env = loadEnv();

try {
  await connectDatabase(env.MONGODB_URI);
} catch (error) {
  console.error('Could not connect to MongoDB:', error.message);
  process.exit(1);
}

const server = createApp({ corsOrigins: env.CLIENT_ORIGIN }).listen(env.PORT, () => {
  console.log(`API ready on http://localhost:${env.PORT}/api`);
});

async function shutdown() {
  server.close();
  await disconnectDatabase();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
