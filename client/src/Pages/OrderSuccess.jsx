import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  // Checkout page se Order ID aur Details yahan aayengi
  const { orderId, paymentMethod } = location.state || { orderId: 'UNKNOWN', paymentMethod: 'cod' };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center pt-[100px] pb-20 px-4 text-center">
      
      {/* Success Icon */}
      <div className="bg-white p-4 rounded-full shadow-lg mb-6 animate-bounce">
        <CheckCircle size={64} className="text-[#84a93e]" />
      </div>

      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Thank You!</h1>
      <p className="text-lg text-gray-600 mb-8">Your order has been received.</p>

      {/* Order Details Box */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-md w-full text-left">
        <div className="flex justify-between border-b border-gray-100 pb-4 mb-4">
          <span className="text-gray-500">Order Number:</span>
          <span className="font-bold text-gray-900">#{orderId}</span>
        </div>
        
        <div className="flex justify-between border-b border-gray-100 pb-4 mb-4">
          <span className="text-gray-500">Date:</span>
          <span className="font-bold text-gray-900">{new Date().toLocaleDateString()}</span>
        </div>

        <div className="flex justify-between pb-2">
          <span className="text-gray-500">Payment Method:</span>
          <span className="font-bold text-gray-900 uppercase">{paymentMethod}</span>
        </div>

        {/* BANK TRANSFER SPECIAL MESSAGE */}
        {paymentMethod === 'bank' && (
          <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded text-sm text-blue-800">
            <strong>Bank Instructions:</strong><br/>
            Please transfer the amount to:<br/>
            Bank: Meezan Bank<br/>
            Account: 1234-5678-9012<br/>
            Ref: Use Order #{orderId}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-8 flex gap-4">
        <Link to="/shop">
          <button className="bg-[#84a93e] text-white px-8 py-3 rounded-full font-bold uppercase hover:bg-[#6e8f30] transition shadow-lg flex items-center gap-2">
            Continue Shopping <ArrowRight size={18} />
          </button>
        </Link>
      </div>

    </div>
  );
};

export default OrderSuccess;