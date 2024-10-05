import mongoose from 'mongoose';
import app from './app';
import { Server } from 'http';
import config from './app/config';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.db_url as string);
    server = app.listen(config.port, () => {
      console.log(`App is listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

// Asynchronous: unhandledRejection
process.on('unhandledRejection', () => {
  console.log('😈 UnhandledRejection is detected! Shutting down the server...');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// Synchronous: uncaughtException
process.on('uncaughtException', () => {
  console.log('😈 UncaughtException is detected! Shutting down the server...');
  process.exit(1);
});
