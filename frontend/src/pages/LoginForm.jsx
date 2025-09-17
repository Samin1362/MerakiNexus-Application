import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

const LoginForm = () => {
  // State management
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // Refs for animations
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  // Initialize entrance animations on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear API error when user types
    if (apiError) {
      setApiError('');
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Shake animation using CSS classes
  const triggerShakeAnimation = () => {
    const container = containerRef.current;
    if (container) {
      container.classList.add('shake');
      setTimeout(() => {
        container.classList.remove('shake');
      }, 400);
    }
  };

  // Success animation using CSS classes
  const triggerSuccessAnimation = () => {
    const container = containerRef.current;
    if (container) {
      container.classList.add('success-pulse');
      setTimeout(() => {
        container.classList.remove('success-pulse');
      }, 400);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      triggerShakeAnimation();
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      const response = await fetch('http://localhost:3000/meraki-nexus-api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success === true) {
        console.log('Login successful');
        triggerSuccessAnimation();
      } else {
        // Login failed - show error message and shake animation
        setApiError('Invalid email or password');
        triggerShakeAnimation();
      }
      
    } catch (error) {
      console.error('Login failed:', error);
      
      // Network or other error - show user-friendly message
      setApiError('Unable to connect to server. Please try again.');
      triggerShakeAnimation();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 flex items-center justify-center p-4 md:p-10">
      <style jsx>{`
        .entrance {
          animation: slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .header-entrance {
          animation: slideInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
        }
        
        .form-entrance {
          animation: slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
        }
        
        .links-entrance {
          animation: slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both;
        }
        
        .shake {
          animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }
        
        .success-pulse {
          animation: successPulse 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }
        
        .button-hover {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .button-hover:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
        }
        
        .input-focus {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .input-focus:focus {
          transform: scale(1.01);
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        
        @keyframes successPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
      
      <div 
        ref={containerRef}
        className={`w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-300 ${
          isVisible ? 'entrance' : 'opacity-0'
        }`}
      >
        {/* Header Section */}
        <div 
          className={`bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 px-8 py-10 text-center relative overflow-hidden ${
            isVisible ? 'header-entrance' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome
            </h1>
            <p className="text-blue-100 text-sm md:text-base opacity-90">
              Sign in to continue to MerakiNexus
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8 md:p-10">
          <div className={`space-y-6 ${isVisible ? 'form-entrance' : 'opacity-0'}`}>
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`input-focus w-full pl-12 pr-4 py-4 border-2 rounded-2xl bg-slate-50/50 transition-all duration-300 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                    errors.email 
                      ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`input-focus w-full pl-12 pr-14 py-4 border-2 rounded-2xl bg-slate-50/50 transition-all duration-300 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                    errors.password 
                      ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm font-medium">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              ref={buttonRef}
              onClick={handleSubmit}
              disabled={isLoading}
              className="button-hover w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-2xl font-semibold text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg flex items-center justify-center group"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                  Signing you in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* API Error Message */}
            {apiError && (
              <div className="text-center animate-in slide-in-from-top duration-300">
                <p className="text-red-500 text-sm font-medium bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  {apiError}
                </p>
              </div>
            )}
          </div>

          {/* Footer Links */}
          <div className={`mt-8 space-y-4 ${isVisible ? 'links-entrance' : 'opacity-0'}`}>
            <div className="text-center">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-all duration-200 px-2 py-1 rounded-lg hover:bg-blue-50">
                Forgot your password?
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <button className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-all duration-200 px-1 py-0.5 rounded hover:bg-blue-50">
                  Sign up now
                </button>
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="px-4 text-xs text-slate-500 bg-white">OR</span>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>

            {/* Social Login Hint */}
            <div className="text-center">
              <p className="text-xs text-slate-500">
                Social login options available after authentication
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;