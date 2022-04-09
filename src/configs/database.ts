import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL || '');

    console.log(`Database connected: ${connection.connection.host}`);
  } catch (e) {
    console.error(e);
  }
};
