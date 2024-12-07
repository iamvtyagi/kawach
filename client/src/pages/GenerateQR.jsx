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
  const [timeLeft, setTimeLeft] = useState(15); // 3 minutes in seconds
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
      if (fileId) {
        console.log('QR Code expired, deleting file...');
        await axios.delete(`/api/v1/file/delete/${fileId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setQrCode(null);
        setQrGenerated(false);
        setDocumentInfo(null);
        setTimerActive(false);
        toast.success('QR Code has expired and file has been deleted');
        // Navigate back to dashboard after deleting of file 
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
      setTimeLeft(15);
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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API}/api/v1/file/${fileId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          toast.success('Document deleted successfully');
          navigate('/dashboard');
        }
      } catch (error) {
        if (error.response?.status === 401) {
          logout();
          navigate('/');
        } else {
          console.error('Delete error:', error);
          toast.error('Error deleting document');
        }
      }
    }
  };

  const loadPdfJsIfNeeded = async () => {
    if (window.pdfjsLib) return;

    // Load PDF.js library
    const pdfjsScript = document.createElement('script');
    pdfjsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    document.head.appendChild(pdfjsScript);

    // Wait for PDF.js to load
    await new Promise((resolve) => {
      pdfjsScript.onload = resolve;
    });
  };

  const printQRCodeWithInfo = async () => {
    try {
      // Get the server URL from environment variable or default to localhost
      const serverUrl = import.meta.env.VITE_API || 'http://localhost:8080';
      
      // Get the QR code information directly from the state
      if (!qrCode) {
        toast.error('Please generate QR code first');
        return;
      }

      // Open a new window with specific settings
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        toast.error('Please allow popups to print');
        return;
      }

      // Write content to the new window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Print Document</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
              overflow-x: hidden; /* Prevent horizontal scrollbar */
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
            }
            img {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 0 auto;
            }
            .pdf-container {
              width: 100%;
              height: 800px;
              border: none;
            }
            @media print {
              .no-print { display: none !important; }
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            ${
              documentInfo.url?.toLowerCase().endsWith('.pdf')
              ? `<object data="${documentInfo.url}" type="application/pdf" class="pdf-container">
                  <embed src="${documentInfo.url}" type="application/pdf" class="pdf-container" />
                </object>`
              : documentInfo.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
              ? `<img src="${documentInfo.url}" alt="Document">`
              : `
                <div>
                  <h1>${documentInfo.name || 'Document'}</h1>
                  <p>Upload Date: ${new Date(documentInfo.uploadDate).toLocaleString()}</p>
                  <div style="text-align: center; margin-top: 20px;">
                    <img src="${qrCode}" alt="QR Code" style="max-width: 200px;" />
                  </div>
                  <a href="${documentInfo.url}" class="no-print" target="_blank">Download File</a>
                </div>
              `
            }
          </div>
          <script>
            // Function to handle printing
            function doPrint() {
              window.print();
              setTimeout(() => window.close(), 500);
            }

            // For PDFs and images, wait for them to load
            window.onload = function() {
              if (document.querySelector('object')) {
                // For PDFs
                setTimeout(doPrint, 1000); // Give PDF time to load
              } else if (document.querySelector('img')) {
                // For images
                const img = document.querySelector('img');
                if (img.complete) {
                  doPrint();
                } else {
                  img.onload = doPrint;
                }
              } else {
                // For other files
                doPrint();
              }
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();

    } catch (error) {
      console.error('Error in print:', error);
      toast.error('Error opening print dialog');
    }
  };

  const handlePrintDocument = async () => {
    if (!fileId) {
      toast.error('No document available');
      return;
    }

    try {
      // Open print route in a new window
      const printUrl = `${import.meta.env.VITE_API}/api/v1/print/${fileId}`;
      window.open(printUrl, '_blank');
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Failed to print document');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white overflow-x-hidden">
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
                      
                      <div className="flex flex-col gap-4">
                        <button
                          onClick={handlePrintDocument}
                          className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                          </svg>
                          Print Document
                        </button>
                        <button
                          onClick={handleDelete}
                          className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-semibold py-3 px-6 rounded-lg transition border border-red-500/20"
                        >
                          <FaTrash className="text-sm" />
                          Delete Document
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* QR Code Display */}
                <div className="flex flex-col items-center p-6 bg-white rounded-xl">
                  <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                  <p className="mt-4 text-gray-900 text-sm font-medium">Scan to access document</p>
                  <p className="text-gray-500 text-sm">Time Remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
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