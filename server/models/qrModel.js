import mongoose from 'mongoose';

const qrSchema = new mongoose.Schema({
    // fileId: This field is used to store the ID of the file associated with the QR code.
    // We have added this field to establish a relationship between the QR code and the file.
    // The type is set to ObjectId to match the ID type in the File model.
    // The ref option is set to 'File' to specify the model that this field references.
    // This field is required to ensure that every QR code is associated with a file.
    fileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: true,
    },
    
    // qrCode: This field is used to store the actual QR code data.
    // We have added this field to store the generated QR code.
    // The type is set to String because the QR code data is typically a string.
    // This field is required to ensure that every QR code document has a valid QR code.
    qrCode: {
        type: String,  //coludinary url
        required: true,
    },      
    
    // fileUrl: This field is used to store the URL of the file associated with the QR code.
    // We have added this field to store the URL of the file.
    // The type is set to String because the URL is typically a string.
    // This field is required to ensure that every QR code document has a valid file URL.
    fileUrl: {
        type: String,
        required: true,
    },
    
    // createdAt: This field is used to store the date and time when the QR code was created.
    // We have added this field to track when the QR code was generated.
    // The type is set to Date to store the date and time.
    // The default value is set to Date.now to automatically set the current date and time when the document is created.
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // cloudinaryPublicId: {
    //     type: String,
    //     required: true,
    // },
});

// Export the model
const QRModel = mongoose.model('QRCode', qrSchema);

export default QRModel;
