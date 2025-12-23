import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Trash2, ArrowLeft, Star, Tag } from 'lucide-react'; // New Icons added
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

  // --- TOGGLE FEATURE (Trending) ---
  const toggleFeatured = async (id, currentValue) => {
    const { error } = await supabase
      .from('products')
      .update({ is_featured: !currentValue }) // True ko False, False ko True karega
      .eq('id', id);

    if (!error) fetchProducts(); // Refresh List
  };

  // --- TOGGLE SALE (Flash Sale) ---
  const toggleSale = async (id, currentValue) => {
    const { error } = await supabase
      .from('products')
      .update({ on_sale: !currentValue })
      .eq('id', id);

    if (!error) fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <Link to="/admin/dashboard" className="flex items-center gap-2 mb-6 text-gray-500 hover:text-black">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Inventory</h1>
        <Link to="/admin/add-product" className="bg-[#84a93e] text-white px-6 py-2 rounded hover:bg-[#6e8f30]">
          + Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-center">Trending</th>
              <th className="p-4 text-center">On Sale</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="p-4 font-bold">{product.name}</td>
                <td className="p-4">Rs. {product.price}</td>
                
                {/* --- TRENDING TOGGLE --- */}
                <td className="p-4 text-center">
                  <button 
                    onClick={() => toggleFeatured(product.id, product.is_featured)}
                    className={`p-2 rounded-full transition ${product.is_featured ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}
                    title="Toggle Trending"
                  >
                    <Star size={20} fill={product.is_featured ? "currentColor" : "none"} />
                  </button>
                </td>

                {/* --- SALE TOGGLE --- */}
                <td className="p-4 text-center">
                  <button 
                    onClick={() => toggleSale(product.id, product.on_sale)}
                    className={`p-2 rounded-full transition ${product.on_sale ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}
                    title="Toggle Flash Sale"
                  >
                    <Tag size={20} />
                  </button>
                </td>

                <td className="p-4 text-center">
                  <button onClick={() => handleDelete(product.id)} className="bg-red-50 text-red-600 p-2 rounded hover:bg-red-600 hover:text-white transition">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;