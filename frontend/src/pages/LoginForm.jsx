import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
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

  // Refs for GSAP animations
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  // const formRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const buttonRef = useRef(null);
  const linksRef = useRef(null);

  // Initialize animations on mount
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    // Container entrance
    gsap.set(containerRef.current, { opacity: 0, y: 50, scale: 0.9 });
    tl.to(containerRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "power3.out"
    });

    // Header animation
    gsap.set(headerRef.current, { opacity: 0, y: -30 });
    tl.to(headerRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4");

    // Form elements stagger animation
    gsap.set([emailRef.current, passwordRef.current, buttonRef.current], { 
      opacity: 0, 
      x: -30 
    });
    tl.to([emailRef.current, passwordRef.current, buttonRef.current], {
      opacity: 1,
      x: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=0.3");

    // Links animation
    gsap.set(linksRef.current, { opacity: 0, y: 20 });
    tl.to(linksRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out"
    }, "-=0.2");

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

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      // Error shake animation
      gsap.to(containerRef.current, {
        x: [-8, 8, -8, 8, 0],
        duration: 0.4,
        ease: "power2.inOut"
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Login successful:', formData);
      
      // Success animation
      gsap.to(containerRef.current, {
        scale: 1.05,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
      
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Button hover animations
  const handleButtonHover = () => {
    gsap.to(buttonRef.current, {
      scale: 1.02,
      boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)",
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleButtonLeave = () => {
    gsap.to(buttonRef.current, {
      scale: 1,
      boxShadow: "0 4px 15px rgba(59, 130, 246, 0.2)",
      duration: 0.3,
      ease: "power2.out"
    });
  };

  // Input focus animations
  const handleInputFocus = (inputRef) => {
    gsap.to(inputRef.current, {
      scale: 1.01,
      duration: 0.2,
      ease: "power2.out"
    });
  };

  const handleInputBlur = (inputRef) => {
    gsap.to(inputRef.current, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 flex items-center justify-center p-4 md:p-10">
      <div 
        ref={containerRef}
        className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
      >
        {/* Header Section */}
        <div 
          ref={headerRef}
          className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 px-8 py-10 text-center relative overflow-hidden"
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
          <div className="space-y-6">
            {/* Email Field */}
            <div ref={emailRef} className="space-y-2">
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
                  onFocus={() => handleInputFocus(emailRef)}
                  onBlur={() => handleInputBlur(emailRef)}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl bg-slate-50/50 transition-all duration-300 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
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
            <div ref={passwordRef} className="space-y-2">
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
                  onFocus={() => handleInputFocus(passwordRef)}
                  onBlur={() => handleInputBlur(passwordRef)}
                  className={`w-full pl-12 pr-14 py-4 border-2 rounded-2xl bg-slate-50/50 transition-all duration-300 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
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
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg flex items-center justify-center group"
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
          </div>

          {/* Footer Links */}
          <div ref={linksRef} className="mt-8 space-y-4">
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