import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUpload, FaHistory, FaSignOutAlt, FaLock, FaQrcode } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Animate from '../components/Animate';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [recentUploads, setRecentUploads] = useState([]);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    console.log('Dashboard mounted, token:', token);
    if (token) {
      fetchRecentUploads();
    } else {
      console.log('No token available');
    }
  }, [token]);

  useEffect(() => {
    console.log('Recent uploads state:', recentUploads);
  }, [recentUploads]);

  const fetchRecentUploads = async () => {
    try {
      console.log('Fetching files with token:', token);
      const response = await axios.get(`${import.meta.env.VITE_API}/api/v1/file`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Files API Response:', response);
      console.log('Files data:', response.data);
      
      if (response.data.success) {
        console.log('Setting files:', response.data.data);
        setRecentUploads(response.data.data || []);
      } else {
        console.log('API returned success: false');
      }
    } catch (error) {
      console.error('Error fetching recent uploads:', error);
      console.error('Error response:', error.response);
      if (error.response?.status === 401) {
        logout();
        navigate('/');
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploadError(null);
      console.log('Uploading file:', selectedFile.name);
      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/v1/files/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Upload API Response:', response);
      console.log('Upload data:', response.data);

      if (response.data.success) {
        toast.success('Document uploaded successfully');
        setSelectedFile(null);
        // Fetch files immediately after successful upload
        await fetchRecentUploads();
      }
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Upload error response:', error.response);
      if (error.response?.status === 401) {
        logout();
        navigate('/');
      } else {
        setUploadError(error.response?.data?.message || 'Error uploading document');
        toast.error('Error uploading document');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-black text-white">
      <Animate /> 

      {/* Navigation Bar */}
      <nav className="relative z-10 bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaLock className="h-8 w-8 text-cyan-500" />
              <span className="ml-2 text-xl font-bold">Kawach</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FaUser className="text-cyan-500" />
                <span>{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-lg transition-colors"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="flex-1 p-2 bg-gray-800 rounded text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
              >
                Upload
              </button>
            </div>
            {uploadError && (
              <p className="text-red-500 text-sm">{uploadError}</p>
            )}
          </form>
        </div>

        {/* Recent Uploads Section */}
        <div className="bg-gray-900 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Recent Uploads</h2>
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="pb-4">Name</th>
                <th className="pb-4">Upload Date</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentUploads && recentUploads.length > 0 ? (
                recentUploads.map((doc) => (
                  <tr key={doc._id} className="border-b border-gray-800">
                    <td className="py-4">{doc.originalname || doc.filename}</td>
                    <td className="py-4">{new Date(doc.createdAt || doc.uploadDate).toLocaleDateString()}</td>
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400">
                        Active
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => navigate('/generate-qr', { state: { fileId: doc._id } })}
                        className="flex items-center gap-2 text-cyan-500 hover:text-cyan-400 transition"
                      >
                        <FaQrcode />
                        Generate QR
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-gray-400">
                    No files uploaded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;