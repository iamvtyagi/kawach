import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope, FaUser, FaPhone } from 'react-icons/fa';
// FaLock: lock icon
// FaEnvelope: envelope icon
// FaUser: user icon
// FaPhone: phone icon
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Animate from '../components/Animate';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo('.signup-card', 
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    );
    tl.fromTo('.form-element', 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { 
      const { name, email, password, phone } = formData; 
      const res = await axios.post(`/api/v1/auth/register`, { name, email, password, phone });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/login');
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ 
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center p-4 overflow-hidden">
      <Animate />
      <div className="signup-card w-full max-w-md bg-gray-900/50 backdrop-blur-xl p-7 rounded-3xl border border-gray-800 relative z-10">
        <div className="text-center mb-6">
          <FaUser className="mx-auto h-11 w-11 text-cyan-500 mb-3" />
          <h2 className="form-element text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text">
            Create Secure Account
          </h2>
          <p className="form-element text-sm text-gray-400 mt-2">
            Join thousands who trust Kawach with their security
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-element relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-500" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="Full name"
              required
            />
          </div>

          <div className="form-element relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-500" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="Email address"
              required
            />
          </div>

          <div className="form-element relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-500" />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="Create strong password"
              required
            />
          </div>

          <div className="form-element relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaPhone className="text-gray-500" />
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="Phone number"
              required
            />
          </div>

          <button
            type="submit"
            className="form-element w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <FaUser className="text-sm" />
            Create Secure Account
          </button>
        </form>

        <p className="form-element mt-4 text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Sign in securely
          </Link>
        </p>

        <div className="form-element mt-6 pt-4 border-t border-gray-800">
          <div className="flex items-center gap-2 justify-center text-sm text-gray-400">
            <FaUser className="text-cyan-500" />
            Protected by Kawach Security
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;