import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Trash2, ArrowLeft, Star, Tag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('isAdmin')) {
      navigate('/admin');
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });
    
    if (data) setProducts(data);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this product?")) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) setProducts(products.filter(p => p.id !== id));
    }
  };

  const toggleFeatured = async (id, currentValue) => {
    const { error } = await supabase
      .from('products')
      .update({ is_featured: !currentValue })
      .eq('id', id);

    if (!error) fetchProducts();
  };

  const toggleSale = async (id, currentValue) => {
    const { error } = await supabase
      .from('products')
      .update({ on_sale: !currentValue })
      .eq('id', id);

    if (!error) fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      
      <Link to="/admin/dashboard" className="flex items-center gap-2 mb-6 text-gray-500 hover:text-black transition">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manage Inventory</h1>
        <Link 
          to="/admin/add-product" 
          className="bg-[#84a93e] text-white px-6 py-2 rounded hover:bg-[#6e8f30] w-full md:w-auto text-center shadow-sm transition"
        >
          + Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden w-full">
        
        {/* --- SCROLL WRAPPER (FIX ADDED HERE) --- */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600 whitespace-nowrap">Image</th>
                <th className="p-4 font-semibold text-gray-600 whitespace-nowrap">Name</th>
                <th className="p-4 font-semibold text-gray-600 whitespace-nowrap">Price</th>
                <th className="p-4 text-center font-semibold text-gray-600 whitespace-nowrap">Trending</th>
                <th className="p-4 text-center font-semibold text-gray-600 whitespace-nowrap">On Sale</th>
                <th className="p-4 text-center font-semibold text-gray-600 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <img 
                      src={product.images && product.images.length > 0 ? product.images[0] : product.image} 
                      alt={product.name} 
                      className="w-12 h-12 object-cover rounded border border-gray-200" 
                    />
                  </td>
                  <td className="p-4 font-bold text-gray-800 whitespace-nowrap">{product.name}</td>
                  <td className="p-4 text-gray-600 whitespace-nowrap">Rs. {product.price}</td>
                  
                  {/* Trending Button */}
                  <td className="p-4 text-center whitespace-nowrap">
                    <button 
                      onClick={() => toggleFeatured(product.id, product.is_featured)}
                      className={`p-2 rounded-full transition shadow-sm ${product.is_featured ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}
                      title="Toggle Trending"
                    >
                      <Star size={18} fill={product.is_featured ? "currentColor" : "none"} />
                    </button>
                  </td>

                  {/* Sale Button */}
                  <td className="p-4 text-center whitespace-nowrap">
                    <button 
                      onClick={() => toggleSale(product.id, product.on_sale)}
                      className={`p-2 rounded-full transition shadow-sm ${product.on_sale ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}
                      title="Toggle Flash Sale"
                    >
                      <Tag size={18} />
                    </button>
                  </td>

                  <td className="p-4 text-center whitespace-nowrap">
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-50 text-red-600 p-2 rounded hover:bg-red-600 hover:text-white transition shadow-sm"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {products.length === 0 && (
          <div className="p-10 text-center text-gray-500">No products found. Add some!</div>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;