import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPrint } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const Print = () => {
  const navigate = useNavigate();
  const {fileId} = useParams();
  const containerRef = useRef(null);
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if fileId exists
    if (!fileId) {
      toast.error('No document selected');
      navigate('/dashboard');
      return;
    }

    // Disable right-click
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    // Disable keyboard shortcuts
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && 
          (e.key === 's' || e.key === 'p' || e.key === 'c' || 
           e.key === 'u' || e.key === 'i')) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    // Fetch file data
    const fetchFile = async () => {
      try {
        console.log('Fetching file with ID:', fileId);
        const response = await axios.get(`/api/v1/print/${fileId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.success) {
          console.log('File data received:', response.data.file);
          setFileData(response.data.file);
        } else {
          toast.error('Failed to load document');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching file:', error);
        toast.error('Error loading document');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchFile();

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [fileId, navigate]);

  const handlePrint = async () => {
    if (!fileData?.url) {
      toast.error('No document available to print');
      return;
    }

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error('Please allow popups to print');
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Print Document</title>
          <style>
            body { margin: 0; }
            img { max-width: 100%; height: auto; }
            @media print {
              body { margin: 0; }
            }
          </style>
          <script>
            function handlePrint() {
              window.print();
              setTimeout(() => window.close(), 500);
            }
          </script>
        </head>
        <body>
          <img src="${fileData.url}" alt="Document" onload="handlePrint();" />
        </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Error printing document');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a0118] to-[#0c0118] text-white p-6">
      <div 
        ref={containerRef}
        className="max-w-2xl mx-auto mt-20 p-8 bg-[#1a1127] rounded-xl shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Print Document
        </h1>

        <div className="space-y-6">
          <div className="bg-[#251934] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Document Details</h2>
            <div className="bg-[#2a2235] p-4 rounded-md">
              <p className="text-gray-300 break-all">
                {fileData?.filename || 'Document not available'}
              </p>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="w-full py-4 px-6 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg
                     hover:from-cyan-500 hover:to-purple-600 transition-all duration-300
                     flex items-center justify-center space-x-2 font-semibold"
          >
            <FaPrint className="text-xl" />
            <span>Print Document</span>
          </button>

          <p className="text-sm text-gray-400 text-center mt-4">
            This is a one-time print access. The link will expire after printing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Print;
