import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaLock, FaArrowLeft, FaTrash, FaQrcode } from 'react-icons/fa';
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
  const [timeLeft, setTimeLeft] = useState(20); // 1 minutes in seconds
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
      setTimeLeft(20);
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



  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0a0118] to-[#0c0118] text-white">
      <Animate />
      
      {/* Navigation Bar */}
      <nav className="relative z-10 bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaLock className="h-8 w-8 text-cyan-500" />
              <span className="ml-2 text-xl font-bold">Kawach</span>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <FaArrowLeft />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 overflow-hidden">
        {/* QR Code Section */}
        <div className="mt-8">
          {qrGenerated ? (
            <div className="space-y-8">
              {/* QR Code Display */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl"></div>
                <div className="relative bg-gray-900/70 backdrop-blur-xl rounded-2xl p-8 border border-gray-800">
                  <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-8">
                    {/* QR Code */}
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur opacity-40 group-hover:opacity-75 transition duration-1000"></div>
                      <div className="relative p-1 bg-black rounded-lg">
                        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg p-4">
                          <img 
                            src={qrCode} 
                            alt="QR Code" 
                            className="w-64 h-64 rounded-lg shadow-2xl transform transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Document Info & Timer */}
                    <div className="flex-1 space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                          Document Details
                        </h3>
                        <div className="space-y-2 text-gray-300">
                          <p><span className="text-gray-400">Name:</span> {documentInfo?.name}</p>
                          <p><span className="text-gray-400">Upload Date:</span> {documentInfo?.uploadDate}</p>
                          <p><span className="text-gray-400">Status:</span> 
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                              {documentInfo?.status}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Timer Display */}
                      <div>
                        <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                          Time Remaining
                        </h3>
                        <div className="flex items-center space-x-4">
                          <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000"
                              style={{ width: `${(timeLeft / 60) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-lg font-mono text-cyan-400 min-w-[4rem]">
                            {timeLeft}s
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-400 mt-4">
                        This QR code will expire in {timeLeft} seconds. Please scan it before it expires.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12">
              <div className="animate-bounce mb-4">
                <FaQrcode className="text-6xl text-cyan-500 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Ready to Generate QR Code
              </h2>
              <p className="text-gray-400 mb-8">
                Click the button below to generate a secure QR code for your document
              </p>
              <button
                onClick={generateQRCode}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg
                         hover:from-cyan-600 hover:to-purple-600 transition-all duration-300
                         flex items-center justify-center space-x-2 font-semibold mx-auto"
              >
                <FaQrcode className="text-xl" />
                <span>Generate QR Code</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default GenerateQR;  