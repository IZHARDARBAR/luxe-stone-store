import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, RefreshCw, Truck } from 'lucide-react';

const Policy = () => {
  return (
    <div className="font-sans text-gray-900 pt-[150px] pb-20 container mx-auto px-6 md:px-12 max-w-4xl">
      
      <h1 className="text-4xl font-serif font-bold mb-8 text-center">Return & Exchange Policy</h1>
      
      <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 space-y-8">
        
        {/* Section 1 */}
        <div className="flex gap-4 items-start">
          <div className="bg-white p-3 rounded-full shadow-sm"><ShieldCheck className="text-[#84a93e]" /></div>
          <div>
            <h3 className="text-xl font-bold mb-2">1. 7 Days Checking Warranty</h3>
            <p className="text-gray-600 leading-relaxed">
              We offer a 7-day checking warranty on all products. If you receive a damaged or incorrect item, you must inform us within 24 hours of delivery.
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="flex gap-4 items-start">
          <div className="bg-white p-3 rounded-full shadow-sm"><RefreshCw className="text-[#84a93e]" /></div>
          <div>
            <h3 className="text-xl font-bold mb-2">2. Return Process</h3>
            <p className="text-gray-600 leading-relaxed">
              To initiate a return, please WhatsApp us at 0355-4952450 with a short video showing the defect. We will review it and arrange an exchange.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="flex gap-4 items-start">
          <div className="bg-white p-3 rounded-full shadow-sm"><Truck className="text-[#84a93e]" /></div>
          <div>
            <h3 className="text-xl font-bold mb-2">3. Refunds & Shipping</h3>
            <p className="text-gray-600 leading-relaxed">
              Delivery charges (Rs. 250) are non-refundable. For refunds, we transfer the amount via JazzCash/EasyPaisa within 3 working days after receiving the returned item.
            </p>
          </div>
        </div>

      </div>

      <div className="text-center mt-12">
        <Link to="/contact">
          <button className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition">
            Contact Support
          </button>
        </Link>
      </div>

    </div>
  );
};

export default Policy;