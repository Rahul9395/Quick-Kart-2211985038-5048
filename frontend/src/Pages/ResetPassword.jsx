import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../Context/UserContext';

function ResetPassword() {
  const { token } = useParams();
  

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);
  const { url, navigate } = useUser()

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setType('error');
      setMessage("Passwords don't match.");
      return;
    }

    setLoading(true);
    setMessage('');
    setType('');

    try {
      const res = await axios.post(`${url}/api/users/reset-password`, {
        token,
        newPassword: password,
      });

      setType('success');
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 3000); 
    } catch (err) {
      setType('error');
      setMessage(err.response?.data?.message || 'Token is invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-md p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center mb-6">Reset Your Password</h2>

        {message && (
          <div className={`mb-4 px-4 py-2 rounded text-sm ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
