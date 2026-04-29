import React, { useEffect, useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../../Context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans bg-white">
      {/* Left Section: Branding with Background Image */}
      <div
        className="w-full md:w-1/2 text-white p-8 relative overflow-hidden flex flex-col justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1500&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />

        <button
          onClick={() => window.history.back()}
          className="absolute top-6 left-6 flex items-center gap-2 text-white hover:text-gray-200 transition duration-200 z-10"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <div className="relative z-10 text-center px-4 mt-12 md:mt-0">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Welcome to <br />
            QuickKart
          </h1>
          <p className="text-lg opacity-90 max-w-md mx-auto">
            Discover top-quality products and enjoy seamless shopping with QuickKart.
          </p>
        </div>
      </div>

      {/* Right Section: Sign-Up Form */}
      <div
        className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1542838686-816d8a6b3a06?auto=format&fit=crop&w=1500&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-0" />
        <div className="relative z-10">
          <div className="bg-white/80 backdrop-blur-lg p-8 rounded-xl shadow-2xl w-full max-w-md border border-white/30">
            <SignUpForm />
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

function SignUpForm() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {SendOtp, registerUser}= useUser();

  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await SendOtp({ email, password });
    if (success) {
      toast.success('OTP sent successfully'); 
      setShowOtpInput(true);
      setLoading(false);
    }
  
};

const handleSignUp = async (e) => {
  e.preventDefault();
  setLoading(true);

  const success = await registerUser({ name, email, password, otp });
   setLoading(false);

  if (success) {
    toast.success('Registration successful! ');
    setName('');
    setEmail('');
    setPassword('');
    setOtp('');
    navigate('/');
  }
};

useEffect(()=>{
  console.log(showOtpInput);
},[showOtpInput])

  return (
    <form onSubmit={showOtpInput ? handleSignUp : handleSendOtp} className="space-y-5">
      <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
        Create Your QuickKart Account
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={showOtpInput}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={showOtpInput}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={showOtpInput}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
      </div>

      {showOtpInput && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
          <input
            type="text"
            maxLength="6"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 tracking-widest text-center"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
      )}

      <button
        type="submit"
        className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition duration-200 ${loading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 shadow-md'
          }`}
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {showOtpInput ? 'Verifying...' : 'Sending OTP...'}
          </div>
        ) : showOtpInput ? 'Verify & Sign Up' : 'Send OTP'}
      </button>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
          Log in
        </Link>
      </p>
    </form>
  );
}
