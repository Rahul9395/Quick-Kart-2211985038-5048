import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react'; // 🌀 Add Loader2 icon
import { useUser } from '../../Context/UserContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser, location } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const success = await loginUser({ email, password });
    setLoading(false);

    if (success) {
      setEmail('');
      setPassword('');
      toast.success('Login successful');


      const redirectPath = location.state?.from || '/';
      navigate(redirectPath, { replace: true });
    } else {
      toast.error('Invalid email or password');
    }
  };


  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1713646778050-2213b4140e6b?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-white hover:text-gray-300 bg-black/40 p-2 rounded-full"
      >
        <ArrowLeft size={22} />
      </button>

      <div className="bg-white shadow-lg rounded-xl w-full max-w-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Login to your account
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-2 right-2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className={`w-full py-2 rounded-lg transition text-white flex items-center justify-center gap-2
                ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>

            <p className="text-center text-sm mt-4">
              Don’t have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
