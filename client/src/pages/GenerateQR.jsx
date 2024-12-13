import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaLock, FaArrowLeft, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Animate from '../components/Animate';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

const GenerateQR = () => {
  const navigate = useNavigate();
  const { user, fileId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [documentInfo, setDocumentInfo] = useState(null);
  const [timeLeft, setTimeLeft] = useState(40); // 3 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleQRExpiration();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  const handleQRExpiration = async () => {
    try {
      if (fileId && timerActive) { // Only delete if timer is active
        console.log('QR Code expired, deleting file...');
        setTimerActive(false); // Prevent multiple delete calls
        await axios.delete(`/api/v1/file/delete/${fileId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setQrCode(null);
        setQrGenerated(false);
        setDocumentInfo(null);
        toast.success('QR Code has expired and file has been deleted');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Error deleting file');
    }
  };

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
      //  // Simulate API delay
      //  await new Promise(resolve => setTimeout(resolve, 7000));  

      // Fetch qr code
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
      
      // Start the timer
      setTimeLeft(40);
      setTimerActive(true);

    } catch (error) {
      setError(error.message || 'Failed to generate QR code');
      console.error('QR Generation Error:', error);
      if (error.response?.status === 401) {
        logout();
        navigate('/');
      } else {
        setError('Failed to generate QR code. Please try again.');
        toast.error('Failed to generate QR code');
      }
    } finally {
      setLoading(false);   // after qr code is generated set loading false
    }
  };

  const handlePrinting = () => {
    console.log('QR Code loaded, ready for printing');
    // You can add any additional logic here if needed
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white overflow-x-hidden">
      <Animate />
      {/* Back to Dashboard Link */}
      <div className="relative z-10 p-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition font-medium"
        >
          <FaArrowLeft />
          Back to Dashboard
        </button>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-full">
        <div className="max-w-3xl mx-auto w-full">
          {/* Header Section */}
          <div className="text-center mb-10 px-4">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
              Document QR Code Generator
            </h1>
            <p className="text-gray-400 text-lg">
              Generate a secure QR code for your document that can be used for one-time access
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 md:p-8 shadow-xl border border-gray-700">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 flex items-center gap-2">
                <FaLock className="flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {!qrGenerated ? (
              <div className="space-y-6">
                {/* Document Preview Section */}
                <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 text-cyan-400">Selected Document</h3>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-cyan-500/10 rounded-lg">
                      <FaLock className="text-2xl text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-gray-300">Ready to generate QR code</p>
                      <p className="text-sm text-gray-500">The document will be accessible via QR code</p>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateQRCode}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating QR Code...
                    </span>
                  ) : (
                    'Generate QR Code'
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Document Information Card */}
                {documentInfo && (
                  <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold mb-6 text-cyan-400">Document Information</h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-4">
                        <div className="break-words">
                          <p className="text-gray-400 text-sm">Document Name</p>
                          <p className="text-lg font-medium">{documentInfo.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Upload Date</p>
                          <p className="text-lg font-medium">{documentInfo.uploadDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Status</p>
                          <p className="text-lg font-medium flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            {documentInfo.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* QR Code Display */}
                <div className="flex flex-col items-center p-6 bg-white rounded-xl">
                  <img 
                    src={qrCode} 
                    alt="QR Code" 
                    className="w-48 h-48" 
                    onLoad={handlePrinting}
                  />
                  <p className="mt-4 text-gray-900 text-sm font-medium">Scan to access document</p>
                  <p className="text-gray-500 text-lg font-bold p-2 rounded-md">Time Remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>This QR code provides one-time secure access to your document.</p>
            <p>After scanning, the document can be viewed and printed securely.</p>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default GenerateQR;  