import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UploadCloud, X, Loader } from 'lucide-react';

const AddProduct = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]); 
  const [previews, setPreviews] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '', price: '', old_price: '', category: 'Electronics', description: '', 
    stock: 10, sizes: '', colors: '', sale_end: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle Images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0) return alert("Select at least 1 image!");
    setUploading(true);
    const imageUrls = [];

    try {
      // 1. Upload Images
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        
        const { error } = await supabase.storage.from('product-images').upload(fileName, file);
        if (error) throw error;
        
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
        imageUrls.push(data.publicUrl);
      }

      // 2. Prepare Data (Clean Empty Strings to NULL)
      const sizeArray = formData.sizes ? formData.sizes.split(',').map(s => s.trim()) : [];
      const colorArray = formData.colors ? formData.colors.split(',').map(c => c.trim()) : [];
      
      // --- FIX IS HERE (Validation) ---
      const finalPrice = formData.price ? Number(formData.price) : 0;
      const finalStock = formData.stock ? Number(formData.stock) : 0;
      const finalOldPrice = formData.old_price ? Number(formData.old_price) : null; // Empty string ko NULL banao
      const finalSaleEnd = formData.sale_end ? formData.sale_end : null; // Date ko bhi check karo

      // 3. Save to Database
      const { error: dbError } = await supabase
        .from('products')
        .insert([{ 
          name: formData.name,
          price: finalPrice,
          old_price: finalOldPrice,
          category: formData.category,
          description: formData.description,
          stock: finalStock,
          images: imageUrls,
          sizes: sizeArray,
          colors: colorArray,
          sale_end: finalSaleEnd
        }]);

      if (dbError) throw dbError;

      alert('Product Added Successfully!');
      navigate('/admin/dashboard');

    } catch (error) {
      console.error("Upload Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <Link to="/admin/dashboard" className="flex items-center gap-2 text-gray-500 mb-6 hover:text-black"><ArrowLeft size={18} /> Back</Link>
        <h1 className="text-2xl font-bold mb-6">Add Product</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" onChange={handleChange} placeholder="Product Name" className="w-full border p-3 rounded" required />
          
          <div className="grid grid-cols-2 gap-4">
            <input name="price" type="number" onChange={handleChange} placeholder="Price" className="border p-3 rounded" required />
            <input name="old_price" type="number" onChange={handleChange} placeholder="Old Price (Optional)" className="border p-3 rounded" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input name="stock" type="number" onChange={handleChange} placeholder="Total Stock (e.g. 10)" className="border p-3 rounded" required />
            <select name="category" onChange={handleChange} className="border p-3 rounded">
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Watches">Watches</option>
                <option value="Shoes">Shoes</option>
                <option value="Beauty">Beauty</option>
                <option value="Home">Home</option>
                <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input name="sizes" onChange={handleChange} placeholder="Sizes (e.g. S, M, L)" className="border p-3 rounded" />
            <input name="colors" onChange={handleChange} placeholder="Colors (e.g. Red, Blue)" className="border p-3 rounded" />
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-500">Flash Sale End Date (Optional)</label>
            <input name="sale_end" type="datetime-local" onChange={handleChange} className="w-full border p-3 rounded" />
          </div>

          {/* Image Upload UI */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 text-center">
            <div className="relative h-20 flex flex-col items-center justify-center cursor-pointer border bg-white rounded mb-2">
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              <UploadCloud className="text-[#84a93e]" />
              <span className="text-xs text-gray-500">Upload Images</span>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {previews.map((src, idx) => (
                <div key={idx} className="relative w-12 h-12 shrink-0 border rounded">
                  <img src={src} className="w-full h-full object-cover rounded" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X size={10} /></button>
                </div>
              ))}
            </div>
          </div>

          <textarea name="description" onChange={handleChange} placeholder="Description" className="w-full border p-3 rounded" rows="3"></textarea>

          <button disabled={uploading} className="w-full bg-[#84a93e] text-white py-3 rounded font-bold hover:bg-[#6e8f30] flex justify-center">
            {uploading ? <Loader className="animate-spin" /> : 'Upload Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;