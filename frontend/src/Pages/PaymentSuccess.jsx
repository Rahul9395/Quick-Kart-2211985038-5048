import React, { useEffect, useState } from 'react';
import { useUser } from '../Context/UserContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PaymentSuccess() {
  const { url } = useUser();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  const [status, setStatus] = useState('loading'); // loading | success | failed
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus('failed');
      setMessage('Session ID not found.');
      return;
    }

    const checkPayment = async () => {
      try {
        const token = localStorage.getItem('token');

        const { data } = await axios.get(
          `${url}/api/users/orders/payment/session/${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        

        if (data.success && data.payment_status === 'paid') {
          setStatus('success');
          setOrderId(data.orderId);
          setMessage('Payment successful! Your order has been placed.');
        } else {
          setStatus('failed');
          setMessage('Payment not completed. Please try again.');
        }
      } catch (err) {
        console.error(err);
        setStatus('failed');
        setMessage('An error occurred while checking payment.');
      }
    };

    checkPayment();
  }, [sessionId, url]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {status === 'loading' && (
            <div className="space-y-6">
              <div className="mx-auto w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Verifying Payment
                </h2>
                <p className="text-gray-600">
                  Please wait while we confirm your payment...
                </p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Payment Successful!
                </h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate(`/orders`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    View My Order
                  </button>
                  <button 
                    onClick={() => navigate('/')}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}

          {status === 'failed' && (
            <div className="space-y-6">
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Payment Failed
                </h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={() => navigate('/')}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Go Home
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Info Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? <a href="/support" className="text-blue-600 hover:text-blue-700 underline">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
