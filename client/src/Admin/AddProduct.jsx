import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UploadCloud, X, Loader } from 'lucide-react';

const AddProduct = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  
  // Multiple Files State
  const [imageFiles, setImageFiles] = useState([]); 
  const [previews, setPreviews] = useState([]);

  const [formData, setFormData] = useState({
    name: '', price: '', category: 'Electronics', description: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- HANDLE MULTIPLE IMAGES ---
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles((prev) => [...prev, ...files]); // Add to existing
      
      // Create Previews
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  // Remove specific image
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
      // 1. Upload All Images (Loop)
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error } = await supabase.storage.from('product-images').upload(filePath, file);
        if (error) throw error;

        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
        imageUrls.push(data.publicUrl);
      }

      // 2. Save Array to Database
      const { error: dbError } = await supabase
        .from('products')
        .insert([{ 
          ...formData, 
          images: imageUrls, // <--- SAVING ARRAY
          stock: 10 
        }]);

      if (dbError) throw dbError;

      alert('Product Added with Multiple Images!');
      navigate('/admin/dashboard');

    } catch (error) {
      console.error(error);
      alert('Upload Failed!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl"> {/* Width badha di */}
        <Link to="/admin/dashboard" className="flex items-center gap-2 text-gray-500 mb-6 hover:text-black">
          <ArrowLeft size={18} /> Back
        </Link>
        
        <h1 className="text-2xl font-bold mb-6">Add Product (Multiple Images)</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" onChange={handleChange} placeholder="Product Name" className="border p-3 rounded" required />
            <input name="price" type="number" onChange={handleChange} placeholder="Price" className="border p-3 rounded" required />
          </div>
          
          <select name="category" onChange={handleChange} className="w-full border p-3 rounded">
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Watches">Watches</option>
            <option value="Shoes">Shoes</option>
            <option value="Beauty">Beauty</option>
            <option value="Home">Home</option>
            <option value="Accessories">Accessories</option>
          </select>

          {/* --- MULTIPLE IMAGE UPLOAD --- */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
            <div className="relative h-32 flex flex-col items-center justify-center cursor-pointer border border-gray-200 bg-white rounded mb-4">
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              <UploadCloud className="text-[#84a93e] mb-2" />
              <span className="text-sm text-gray-500">Click to Select Images</span>
            </div>

            {/* Previews Grid */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {previews.map((src, idx) => (
                <div key={idx} className="relative w-20 h-20 shrink-0 border rounded">
                  <img src={src} alt="preview" className="w-full h-full object-cover rounded" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow">
                    <X size={14} />
                  </button>
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