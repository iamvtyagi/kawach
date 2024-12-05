import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import { FaShieldAlt, FaLock, FaUserShield, FaFingerprint } from 'react-icons/fa';
import Animate from '../components/Animate';
import logo from '../assets/logo.svg';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo('.logo-container',
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );
    tl.fromTo('.project-title',
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    );
    tl.fromTo('.hero-text', 
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.2, ease: 'power3.out' },
      '-=0.5'
    );
    tl.fromTo('.feature-card', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
      '-=0.4'
    );
    tl.fromTo('.stat', 
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out' },
      '-=0.4'
    );
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Logo and Project Name */}
      <div className="flex items-center px-8 py-6">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Kawach Logo" className="w-12 h-12 logo-container" />
          <h1 className="project-title text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400">
            KAWACH
          </h1>
        </div>
      </div>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <Animate />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <FaShieldAlt className="hero-text mx-auto h-20 w-20 text-blue-500 mb-8 animate-float" />
            <h1 className="hero-text text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 text-transparent bg-clip-text">
              Secure Your Digital World
            </h1>
            <p className="hero-text text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
              Kawach provides enterprise-grade security for your sensitive data, 
              ensuring privacy and protection in an increasingly connected world.
            </p>
             {/* Conditional rendering based on user state -> if user is not logged in the two buttons will be displayed */}
            {!user && (  
              <div className="hero-text flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded-lg hover:opacity-90 transition flex items-center gap-2"
                >
                  <FaLock className="text-xl" />
                  Secure Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-4 rounded-lg hover:opacity-90 transition flex items-center gap-2"
                >
                  <FaUserShield className="text-xl" />
                  Join Securely
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="feature-card bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl border border-gray-800">
            <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
              <FaFingerprint className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Secure Password Protection</h3>
            <p className="text-gray-400">Advanced password hashing and security measures to keep your account protected at all times.</p>
          </div>
          
          <div className="feature-card bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl border border-gray-800">
            <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6">
              <FaLock className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold mb-4">End-to-End Encryption</h3>
            <p className="text-gray-400">Your data is encrypted at every step, from storage to transmission, using military-grade protocols.</p>
          </div>
          
          <div className="feature-card bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl border border-gray-800">
            <div className="h-12 w-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-6">
              <FaUserShield className="h-6 w-6 text-cyan-500" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Privacy First</h3>
            <p className="text-gray-400">Your privacy is our priority. We never share or sell your data to third parties.</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="stat text-center">
            <div className="text-4xl font-bold text-blue-500">99.99%</div>
            <div className="text-gray-400 mt-2">Uptime Security</div>
          </div>
          <div className="stat text-center">
            <div className="text-4xl font-bold text-purple-500">1M+</div>
            <div className="text-gray-400 mt-2">Protected Files</div>
          </div>
          <div className="stat text-center">
            <div className="text-4xl font-bold text-cyan-500">24/7</div>
            <div className="text-gray-400 mt-2">Security Monitoring</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;