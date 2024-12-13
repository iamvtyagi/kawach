import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUpload, FaHistory, FaSignOutAlt, FaLock, FaQrcode } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Animate from '../components/Animate';
import axios from 'axios';
import toast from 'react-hot-toast';
import { gsap } from 'gsap';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, setFile } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null); // Stores the file that the user has selected or dropped.
  const [dragActive, setDragActive] = useState(false);  //Tracks whether the drag-and-drop zone is active (e.g., while dragging a file over it).
  const securityMessageRef = useRef(null);

  // Security message for users
  const securityMessage = {
    title: "Secure File Handling",
    description: "Your privacy is our top priority. Files are automatically deleted after printing, leaving absolutely no trace behind. We ensure complete confidentiality of your sensitive documents.",
    icon: "🔒"
  };

  useEffect(() => {
    gsap.fromTo(securityMessageRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1 });
  }, []);

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
      
      if (res.data.success) {
        setFile(res.data.fileId);
        toast.success('File uploaded successfully');
        navigate('/generate-qr'); // Navigate after successful upload   ?????????
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
              <div>
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
              </div>
            )}
          </div>
        </div>

        {/* Security Message Section */}
        <div ref={securityMessageRef} className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-8 mt-6 border border-cyan-500/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl">{securityMessage.icon}</div>
            <h2 className="text-2xl font-bold text-cyan-500">{securityMessage.title}</h2>
          </div>
          <p className="text-lg text-gray-300 leading-relaxed">{securityMessage.description}</p>
          <div className="mt-6 flex items-center gap-2 text-cyan-400">
            <FaLock className="w-5 h-5" />
            <span>Your documents are protected with enterprise-grade security</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;