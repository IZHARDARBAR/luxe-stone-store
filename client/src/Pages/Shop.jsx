import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
import { Search, ChevronDown, Star } from 'lucide-react';
import { useCart } from '../context/CartContext'; 
import { Link } from 'react-router-dom';

const Shop = () => {
  const [shopProducts, setShopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Categories List
  const categories = [
    'All', 'Electronics', 'Fashion', 'Watches', 'Shoes', 
    'Beauty', 'Home', 'Accessories', 'Kids'
  ];

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from('products').select('*');

      // Search Logic
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      // Filter Logic
      if (selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory);
      }

      let { data, error } = await query;
      if (error) console.error(error);
      else setShopProducts(data || []);
      setLoading(false);
    };

    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="font-sans text-gray-900 pt-[100px]">
      
     {/* HEADER BANNER UPDATE */}
      <div className="relative h-[80vh] w-full flex items-center justify-center bg-gray-900 mb-10">
        <div className="absolute inset-0 overflow-hidden">
          {/* New Retail Store Image */}
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000" 
            alt="Shop Background" 
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <h1 className="relative z-10 text-5xl md:text-6xl font-bold text-white font-serif tracking-wide text-center px-4">
          Explore Our Collection
        </h1>
      </div>
      <div className="container mx-auto px-6 md:px-12">
        
        {/* --- SEARCH & FILTER BAR --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-[#84a93e] transition"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {/* Category Filter Buttons */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold border transition whitespace-nowrap ${
                  selectedCategory === cat 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        <section className="pb-24">
          {loading ? (
            <div className="text-center py-20 text-gray-500 text-xl">Searching items...</div>
          ) : shopProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-lg">No products found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {shopProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

// --- PRODUCT CARD COMPONENT ---
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  // Stock Logic
  const isOutOfStock = product.stock <= 0;

  // Image Logic: Use first image from array, or fallback if empty
  const displayImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://via.placeholder.com/300?text=No+Image';

  return (
    <div className="group relative">
      {/* Link to Detail Page */}
      <Link to={`/product/${product.id}`}>
        <div className="relative h-[350px] w-full overflow-hidden bg-gray-100 mb-5 rounded-lg border border-gray-100">
          <img
            src={displayImage}
            alt={product.name}
            className={`h-full w-full object-cover transition duration-700 group-hover:scale-110 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
          />
          
          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <span className="bg-red-600 text-white px-4 py-2 font-bold text-sm uppercase tracking-wider shadow-lg">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex flex-col items-start">
        <div className="flex text-gray-300 mb-2 gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill="currentColor" />
          ))}
        </div>

        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#84a93e] transition-colors line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
        
        <div className="flex justify-between items-center w-full mt-2">
          <p className="font-bold text-xl text-gray-900">Rs. {product.price}</p>
          
          {/* Add to Cart Button (Only if Stock Available) */}
          {!isOutOfStock && (
            <button 
              onClick={() => addToCart(product)}
              className="bg-[#84a93e] text-white px-4 py-2 rounded text-sm font-bold hover:bg-[#6e8f30] transition shadow-sm"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;