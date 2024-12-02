import mongoose from "mongoose";
import colors from 'colors'

const connectDb = async () => {
  try {
      console.log('MongoDB Connection String:', process.env.MONGO_URL); // Log the connection string
      const conn = await mongoose.connect(process.env.MONGO_URL);
      console.log(`Connected to database ${conn.connection.host}`.bgMagenta.white);
  } catch (err) {
      console.log(`Error in mongoDb ${err}`.bgRed.white);
  }
};

export default connectDb