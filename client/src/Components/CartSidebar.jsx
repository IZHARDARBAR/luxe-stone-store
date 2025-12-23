import React from 'react';
import { X, ShoppingBag, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Import Hook

const CartSidebar = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, cartTotal } = useCart(); // Real Data

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 backdrop-blur-sm ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={onClose}></div>

      <div className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-serif font-bold text-gray-900">Shopping Cart</h2>
          <button onClick={onClose} className="p-2 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-black"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length > 0 ? (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-center group relative">
                  <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 font-medium">{item.name}</h4>
                    <p className="text-gray-500 text-sm mt-1">{item.quantity} × <span className="text-gray-900 font-semibold">Rs. {item.price}</span></p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors"><XCircle size={22} strokeWidth={1.5} /></button>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="mb-4 text-gray-300"><ShoppingBag size={64} strokeWidth={1} /></div>
              <p className="text-gray-500 text-lg">No products in the cart.</p>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <div className="flex justify-between items-center mb-6 text-lg font-medium text-gray-900">
              <span>Subtotal:</span>
              <span className="font-bold text-[#84a93e]">Rs. {cartTotal}</span>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/cart" onClick={onClose} className="w-full"><button className="w-full bg-[#84a93e] text-white py-3 rounded-full font-bold uppercase tracking-wider hover:bg-[#6e8f30] transition shadow-md">View Cart</button></Link>
              <Link to="/checkout" onClick={onClose} className="w-full"><button className="w-full bg-[#84a93e] text-white py-3 rounded-full font-bold uppercase tracking-wider hover:bg-[#6e8f30] transition shadow-md">Checkout</button></Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default CartSidebar;