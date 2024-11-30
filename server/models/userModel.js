import mongoose from "mongoose";

// Define the schema for the user model
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  // Enable timestamps to automatically add createdAt and updatedAt fields to the schema
  { timestamps: true }
);

// Export the model
export default mongoose.model("users", userSchema);