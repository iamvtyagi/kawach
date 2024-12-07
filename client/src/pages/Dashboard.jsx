import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUpload, FaHistory, FaSignOutAlt, FaLock, FaQrcode } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Animate from '../components/Animate';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, setFile } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null); // Stores the file that the user has selected or dropped.
  const [dragActive, setDragActive] = useState(false);  //Tracks whether the drag-and-drop zone is active (e.g., while dragging a file over it).
  
  // Mock data for recent uploads (replace with actual data from backend API)
  const recentUploads = [
    { id: 1, name: 'ID_Card.pdf', date: '2024-01-15', status: 'Active' },
    { id: 2, name: 'Contract.pdf', date: '2024-01-14', status: 'Expired' },
    { id: 3, name: 'License.pdf', date: '2024-01-13', status: 'Active', },
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();  // Prevents the event from continuing to propagate further through the DOM tree. It stops the event at the current element, preventing parent elements from being notified.
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);    //// Visually indicate the drop area is active
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      await handleUpload(file);  // Pass the file directly
    }
  };

  const handleFileSelect = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      await handleUpload(file);  // Pass the file directly
    }
  };

  const handleUpload = async (file) => {
    try {
      console.log('Upload started, file:', file);
      if (!file) return;
      
      const formData = new FormData();
      formData.append('file', file);
      console.log('FormData created with file');


      const res = await axios.post('/api/v1/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Upload response:', res.data);
      setFile(res.data.fileId);

      if (res.data.success) {
        toast.success('File uploaded successfully');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Upload error details:', error.response?.data || error.message);
      toast.error('Error uploading file');
    }
  };

  const handleLogout = () => {    
    logout();          // token is removed from localstorage 
    navigate('/');
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-black text-white">
      
     <Animate/> 

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
        <div className="bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl border border-gray-800 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FaUpload className="text-cyan-500" />
            Upload Document
          </h2>
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center ${
              dragActive ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-700'
            }`}
            // are part of HTML5's native Drag and Drop API.
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (      // if file is selected run this
              <div className="space-y-4">
                <p className="text-cyan-500">Selected: {selectedFile.name}</p>
                <button
                  onClick= {() => navigate('/generate-qr')}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 rounded-lg hover:opacity-90 transition"
                >
                  Generate QR Code
                </button>
              </div>
            ) : (   //if not selected run this
              <>
                <FaUpload className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <p className="text-gray-400 mb-4">
                  Drag and drop your document here, or click to select
                </p>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="fileInput"
                  name="file"
                />
                <label
                  htmlFor="fileInput"
                  className="bg-gray-800 px-6 py-3 rounded-lg hover:bg-gray-700 transition cursor-pointer"
                >
                  Select File
                </label>
              </>
            )}

          </div>
        </div>

        {/* Recent Uploads Section */}
        <div className="bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl border border-gray-800">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FaHistory className="text-cyan-500" />
            Recent Uploads
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-4">Document Name</th>
                  <th className="text-left py-4">Upload Date</th>
                  <th className="text-left py-4">Status</th>
                  <th className="text-left py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentUploads.map((doc) => (
                  <tr key={doc.id} className="border-b border-gray-800">
                    <td className="py-4">{doc.name}</td>
                    <td className="py-4">{doc.date}</td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          doc.status === 'Active'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => navigate('/generate-qr')}
                        className="flex items-center gap-2 text-cyan-500 hover:text-cyan-400 transition"
                      >
                        <FaQrcode />
                        View QR
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;