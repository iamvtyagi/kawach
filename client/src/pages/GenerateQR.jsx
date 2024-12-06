import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaArrowLeft, FaTrash, FaQrcode, FaCopy, FaQrcode as FaScan, FaLink, FaPrint } from 'react-icons/fa';
import jsQR from 'jsqr';
import { useAuth } from '../context/AuthContext';
import Animate from '../components/Animate';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const GenerateQR = () => {
  const navigate = useNavigate();
  const { user, fileId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [documentInfo, setDocumentInfo] = useState(null);

  const generateQRCode = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!fileId) {
        setError('No file selected. Please upload a file first.');
        return;
      }

      // Clear previous QR code while loading
      if (qrGenerated) {
        setQrCode(null);
      }
       // Simulate API delay
       await new Promise(resolve => setTimeout(resolve, 10000));    // abhi ya pause ha bec kuch or chl rha hai

      //fetch qr code
      const res = await axios.get(`/api/v1/file/qrcode/${fileId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!res.data.success) {
        throw new Error(res.data.message);
      }

      const { qrCode, fileName, uploadDate } = res.data;

      // Set the new QR code
      setQrCode(qrCode);
      setDocumentInfo({
        name: fileName,
        uploadDate: new Date(uploadDate).toLocaleDateString(),
        status: 'Active'
      });

      setQrGenerated(true);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate QR code. Please try again.');
      console.error('QR Generation Error:', err);
      setQrGenerated(false)
    } finally {
      setLoading(false);   // after qr code is generated set loading false
    }
  };


  const handleDelete = async () => {
    // TODO: Implement delete functionality
    if (window.confirm('Are you sure you want to delete this document?')) {
      // Add delete logic here
    }
  };

  // Print function
  // const handlePrint = () => {
  //   if (qrCodeUrl) {
  //     // Create a new window
  //     const printWindow = window.open('', '_blank');
      
  //     // Write the content to be printed
  //     printWindow.document.write(`
  //       <html>
  //         <head>
  //           <title>QR Code Content</title>
  //         </head>
  //         <body style="height:100vh width:100vw">
  //           <div class="container">
  //             <img src="${qrCodeUrl}" alt="QR Code" class="qr-code"/>
  //             </div>
  //           </div>
  //         </body>
  //       </html>
  //     `);
      
  //     // Close the document
  //     printWindow.document.close();
      
  //     // Wait for images to load then print
  //     printWindow.onload = function() {
  //       printWindow.focus();
  //       printWindow.print();
  //     };
  //   } else {
  //     toast.error('No QR code data to print');
  //   }
  // };

  useEffect(() => {
    // Decode QR code whenever qrCode changes  
    //Canvas ka main role hai QR code image ko load karke, uska pixel data extract karna, jisse jsQR library use karke QR code decode kiya ja sake.
    if (qrCode) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        
        context.drawImage(img, 0, 0);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          setQrCodeUrl(code.data);
        }
      };

      img.onerror = () => {
        console.error('Failed to load QR code image');
      };

      img.src = qrCode;
    }
  }, [qrCode]);

  return (
    <div className="relative overflow-hidden min-h-screen bg-black text-white">
      <Animate />
      {/* Back to Dashboard Link */}
      <div className="relative z-10 p-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-cyan-500 hover:text-cyan-400 transition"
        >
          <FaArrowLeft />
          Back to Dashboard
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <div className="bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl border border-gray-800">
          {/* Document Title */}
          <h1 className="text-2xl font-bold mb-6">{documentInfo?.name}</h1>

          {/* Document Info */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <p className="text-gray-400">Upload Date</p>
              <p>{documentInfo?.uploadDate}</p>
            </div>
            <div>
              <p className="text-gray-400">Status</p>
              <p className="text-green-400">{documentInfo?.status}</p>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="bg-gray-800/50 p-6 rounded-xl mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaQrcode className="mr-2 text-cyan-500" />
              Temporary Access QR Code
            </h2>

            {qrGenerated ? (
              <div className="bg-gray-800/50 p-8 rounded-lg mb-4">
                <div className="flex flex-col items-center">
                  <div className="bg-gray-900/50 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <div className="w-48 h-48 relative">
                      <img 
                        src={qrCode} 
                        alt="Generated QR Code" 
                        className="w-full h-full object-contain bg-white rounded-md"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-md"></div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm mb-2">Scan this QR code to access the document</p>
                    <div className="flex items-center justify-center space-x-4">
                      <button
                        onClick={() => window.open(qrCode, '_blank')}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg
                          hover:bg-cyan-500/30 transition-colors"
                      >
                        <FaQrcode />
                        View Full Size
                      </button>
                      <button
                        onClick={() => {
                          if (qrCodeUrl) {
                            navigator.clipboard.writeText(qrCodeUrl);
                            toast.success('URL copied to clipboard!');
                          } else {
                            toast.error('No URL found in QR code');
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg
                          hover:bg-gray-700/70 transition-colors"
                      >
                        <FaCopy />
                        Copy URL
                      </button>
                      {/* <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg
                          hover:bg-gray-700/70 transition-colors"
                      >
                        <FaPrint />
                        Print
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={generateQRCode}   // click ka bad turnt loading true hojayga and after 5sec false ho jayga but false hona sa pahla qrGenerated true hojayga and upr wala display ho jayga
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-4 rounded-lg
                  transform transition-all duration-300
                  hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20
                  active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Generating...
                  </>
                ) : (
                  <div className='flex items-center gap-2 justify-center'>
                    <FaQrcode />
                    Generate Temporary QR Code
                  </div>
                )}
              </button>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                {error}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-start gap-4">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-6 py-2 rounded-lg transition-colors"
            >
              <FaTrash />
              Delete
            </button>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default GenerateQR;
