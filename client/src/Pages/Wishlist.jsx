import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    // Load from Local Storage
    const saved = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(saved);
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    toast.error("Removed from Wishlist");
  };

  const moveToCart = (item) => {
    addToCart(item);
    removeFromWishlist(item.id);
  };

  return (
    <div className="font-sans text-gray-900 pt-[120px] pb-20 container mx-auto px-6 md:px-12">
      <h1 className="text-4xl font-serif font-bold mb-8 flex items-center gap-3">
        <Heart className="text-red-500 fill-current" /> My Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Your wishlist is empty.</p>
          <Link to="/shop">
            <button className="mt-6 bg-black text-white px-6 py-2 rounded-full font-bold">Go Shopping</button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlist.map((item) => (
            <div key={item.id} className="group relative border rounded-lg p-4 hover:shadow-lg transition">
              <Link to={`/product/${item.id}`}>
                <div className="h-64 bg-gray-100 rounded overflow-hidden mb-4">
                  <img 
                    src={item.images && item.images.length > 0 ? item.images[0] : (item.image || 'https://via.placeholder.com/300')} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
              </Link>
              
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-[#84a93e] font-bold">Rs. {item.price}</p>
              
              <div className="flex gap-2 mt-4">
                <button onClick={() => moveToCart(item)} className="flex-1 bg-black text-white py-2 rounded flex items-center justify-center gap-2 text-sm font-bold hover:bg-gray-800">
                  <ShoppingBag size={16} /> Add to Cart
                </button>
                <button onClick={() => removeFromWishlist(item.id)} className="bg-red-50 text-red-500 p-2 rounded hover:bg-red-100">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;