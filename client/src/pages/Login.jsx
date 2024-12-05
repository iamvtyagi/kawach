import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope, FaShieldAlt } from 'react-icons/fa';  //inserts svg in the dynamiccode
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import Animate from '../components/Animate';


const Login = () => {
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo('.login-card', 
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
      const {email, password } = formData; 
        const res = await axios.post('/api/v1/auth/login', { email, password });
        if (res.data.success) {  
            toast.success(res.data.message);
            login(res.data.user, res.data.token);  // res.send ma backened ma -> user and token send kiya ha
            navigate('/dashboard');
        } else {
            toast.error(res.data.message, { position: "top-center" });
        }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong", { position: "top-center" });
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev,[name]: value})); // Update form data (spread previous key value pair + new key value pair)
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center p-4 overflow-hidden">
      <Animate />
      <div className="login-card w-full max-w-md bg-gray-900/50 backdrop-blur-xl p-8 rounded-3xl border border-gray-800 relative z-10">
        <div className="text-center mb-8">
          <FaShieldAlt className="mx-auto h-12 w-12 text-blue-500 mb-4" />  
          <h2 className="form-element text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            Secure Login
          </h2>
          <p className="form-element text-sm text-gray-400 mt-2">
            Protected by enterprise-grade security
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-element relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-500" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-colors"
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
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Password"
              required
            />
          </div>

          <div className="form-element flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-700 bg-gray-800/50 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-2 text-gray-400">
                Stay signed in
              </label>
            </div>
            <a href="#" className="text-blue-400 hover:text-blue-300">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="form-element w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <FaLock className="text-sm" />
            Secure Sign In
          </button>
        </form>

        <p className="form-element mt-6 text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:text-blue-300 transition-colors">
            Create secure account
          </Link>
        </p>

        <div className="form-element mt-8 pt-6 border-t border-gray-800">
          <div className="flex items-center gap-2 justify-center text-sm text-gray-400">
            <FaShieldAlt className="text-blue-500" />
            Protected by Kawach Security
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;