import React from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentCancel() {
  const navigate = useNavigate();

return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="space-y-6">
            {/* Warning Icon */}
            <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Payment Canceled
              </h2>
              <div className="space-y-3 text-gray-600 mb-8">
                <p>
                  You canceled the payment process. No money has been charged.
                </p>
                <p>
                  If this was a mistake, you can try again to complete your order.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/cart')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Return to Cart
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
        </div>

        {/* Additional Info Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? <a href="/support" className="text-orange-600 hover:text-orange-700 underline">Contact Support</a>
          </p>
        </div>

        {/* Security Notice */}
        <div className="mt-4 bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Your payment information is secure and was not processed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentCancel;
