import mongoose from 'mongoose';

const SERVER_SELECTION_TIMEOUT_MS = 10_000;

export async function connectDatabase(uri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS });
}

export const disconnectDatabase = () => mongoose.disconnect();
