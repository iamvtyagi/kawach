import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: false,
  },
  content: {
    type: Buffer,
    required: false,
  },
  mimetype: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  user: {
    // This line specifies the data type for the 'user' field as an ObjectId, which is a unique identifier for documents in MongoDB.
    // It is a reference to the ObjectId type defined in the mongoose.Schema.Types object.
    // The 'ref' property specifies the model that this ObjectId refers to, which in this case is the 'User' model.
    // This allows for population of the 'user' field with the actual user document when querying the File model.
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  PublicId: {
    type: String,
    required: true,
  },
});

// Export the model
const FileModel = mongoose.model('File', fileSchema);

export default FileModel;
