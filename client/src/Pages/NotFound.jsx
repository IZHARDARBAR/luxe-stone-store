import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center bg-gray-50 px-4">
      <h1 className="text-9xl font-bold text-gray-300">404</h1>
      <h2 className="text-3xl font-serif font-bold text-gray-800 mt-4">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-md mt-2">
        Oops! The page you are looking for might have been removed or is temporarily unavailable.
      </p>
      
      <Link to="/">
        <button className="bg-[#84a93e] text-white px-8 py-3 rounded-full font-bold hover:bg-[#6e8f30] transition flex items-center gap-2 shadow-lg">
          <Home size={20} /> Go Back Home
        </button>
      </Link>
    </div>
  );
};

export default NotFound;