import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope, FaUser, FaShieldAlt, FaKey } from 'react-icons/fa';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    login(formData);
    navigate('/');
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
      {/* Animated background elements */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl -top-40 -left-40 animate-pulse"></div>
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl -bottom-40 -right-40 animate-pulse delay-1000"></div>

      <div className="signup-card w-full max-w-md bg-gray-900/50 backdrop-blur-xl p-7 rounded-3xl border border-gray-800 relative z-10">
        <div className="text-center mb-6">
          <FaKey className="mx-auto h-11 w-11 text-cyan-500 mb-3" />
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
              <FaKey className="text-gray-500" />
            </div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="Confirm password"
              required
            />
          </div>

          <div className="form-element">
            <div className="flex items-center flex-between">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-700 bg-gray-800/50 text-cyan-500 focus:ring-cyan-500"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
                I agree to the{' '}
                <a href="#" className="text-cyan-400 hover:text-cyan-300">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-cyan-400 hover:text-cyan-300">
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="form-element w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <FaShieldAlt className="text-sm" />
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
            <FaShieldAlt className="text-cyan-500" />
            Protected by Kawach Security
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;