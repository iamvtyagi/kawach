import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaLock, FaArrowLeft, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Animate from '../components/Animate';
import axios from 'axios';
import toast from 'react-hot-toast';

const GenerateQR = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [documentInfo, setDocumentInfo] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const fileId = location.state?.fileId;

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    if (fileId) {
      fetchDocumentInfo();
    } else {
      navigate('/dashboard');
    }
  }, [fileId, navigate, token]);

  const fetchDocumentInfo = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/api/v1/file/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.data.success) {
        setDocumentInfo(response.data.file);
      }
    } catch (error) {
      console.error('Error fetching document info:', error);
      if (error.response?.status === 401) {
        logout();
        navigate('/');
      } else {
        setError('Failed to fetch document information');
        toast.error('Error fetching document information');
      }
    }
  };

  const generateQRCode = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/v1/qr/generate`,
        JSON.stringify({ fileId }),  
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('QR response:', response.data);

      if (response.data.success) {
        setQrCode(response.data.qrCode);
        setQrGenerated(true);
        toast.success('QR code generated successfully');
      }
    } catch (err) {
      console.error('QR Generation Error:', err);
      if (err.response?.status === 401) {
        logout();
        navigate('/');
      } else {
        setError('Failed to generate QR code. Please try again.');
        toast.error('Failed to generate QR code');
      }
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
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
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {documentInfo ? (
          <div className="bg-gray-900 rounded-lg p-6">
            {/* Document Title */}
            <h2 className="text-2xl font-bold mb-6">Generate QR Code</h2>
            <div className="mb-6">
              <p className="text-gray-400">File Name: {documentInfo.originalname || documentInfo.filename}</p>
              <p className="text-gray-400">Upload Date: {new Date(documentInfo.createdAt || documentInfo.uploadDate).toLocaleDateString()}</p>
            </div>

            {/* QR Code Section */}
            <div className="bg-gray-800/50 p-6 rounded-xl mb-6">
              <h2 className="text-xl font-semibold mb-4">Temporary Access QR Code</h2>
              
              {!qrGenerated ? (
                <button
                  onClick={generateQRCode}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-4 rounded-lg
                    transform transition-all duration-300
                    hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20
                    active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating...' : 'Generate Temporary QR Code'}
                </button>
              ) : (
                <div className="text-center">
                  {qrCode && (
                    <div className="mb-4">
                      <img
                        src={`data:image/png;base64,${qrCode}`}
                        alt="QR Code"
                        className="mx-auto"
                      />
                    </div>
                  )}
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                  >
                    Back to Dashboard
                  </button>
                </div>
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
        ) : (
          <div className="text-center">
            <p className="text-gray-400">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateQR;
