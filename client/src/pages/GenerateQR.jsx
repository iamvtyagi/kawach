import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaArrowLeft, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Animate from '../components/Animate';

const GenerateQR = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrGenerated, setQrGenerated] = useState(false);

  // Mock data (replace with actual data from your backend)
  const documentInfo = {
    name: 'R295G93ApplicationForm.pdf',
    uploadDate: '11/10/2024',
    status: 'Active'
  };

  const generateQRCode = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: API call to generate QR code
      // const response = await fetch('YOUR_API_ENDPOINT', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //   },
      // });
      // const data = await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setQrGenerated(true);
    } catch (err) {
      setError('Failed to generate QR code. Please try again.');
      console.error('QR Generation Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    // TODO: Implement delete functionality
    if (window.confirm('Are you sure you want to delete this document?')) {
      // Add delete logic here
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-black text-white">
      <Animate/>
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
          <h1 className="text-2xl font-bold mb-6">{documentInfo.name}</h1>

          {/* Document Info */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <p className="text-gray-400">Upload Date</p>
              <p>{documentInfo.uploadDate}</p>
            </div>
            <div>
              <p className="text-gray-400">Status</p>
              <p className="text-green-400">{documentInfo.status}</p>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="bg-gray-800/50 p-6 rounded-xl mb-6">
            <h2 className="text-xl font-semibold mb-4">Temporary Access QR Code</h2>
            
            {qrGenerated ? (
              <div className="bg-white p-8 rounded-lg mb-4">
                {/* QR Code will be displayed here */}
                <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-black">QR Code</span>
                </div>
              </div>
            ) : (
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
    </div>
  );
};

export default GenerateQR;
