import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // useNavigate added
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';
import { Star, ArrowLeft, MessageCircle, ShoppingBag, User, Trash2, Zap } from 'lucide-react'; // Zap added
import { Helmet } from 'react-helmet-async';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook for navigation
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(''); 
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Review Form
  const [reviewForm, setReviewForm] = useState({ user_name: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const { addToCart } = useCart();
  const isAdmin = localStorage.getItem('isAdmin'); 

  useEffect(() => {
    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProductData = async () => {
    setLoading(true);
    
    // 1. Current Product
    const { data: currentProduct, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !currentProduct) {
      setLoading(false);
      return;
    }
    setProduct(currentProduct);
    
    // Set Initial Main Image
    if (currentProduct.images && currentProduct.images.length > 0) {
      setMainImage(currentProduct.images[0]);
    } else {
      setMainImage(currentProduct.image); // Fallback to old image column
    }

    // 2. Fetch Reviews
    const { data: reviewsData } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', id)
      .order('created_at', { ascending: false });
    setReviews(reviewsData || []);

    // 3. Fetch Related Products
    const { data: relatedData } = await supabase
      .from('products')
      .select('*')
      .eq('category', currentProduct.category)
      .neq('id', id)
      .limit(4);
    setRelatedProducts(relatedData || []);
    
    setLoading(false);
  };

  // --- REVIEW SUBMIT ---
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.user_name || !reviewForm.comment) return alert("Fill all fields");

    setSubmitting(true);
    const { error } = await supabase.from('reviews').insert([{ ...reviewForm, product_id: id }]);

    if (!error) {
      alert("Review Submitted!");
      setReviewForm({ user_name: '', rating: 5, comment: '' });
      fetchProductData();
    } else {
      alert("Error submitting review");
    }
    setSubmitting(false);
  };

  // --- DELETE REVIEW ---
  const deleteReview = async (reviewId) => {
    if (confirm("Delete this review?")) {
      const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
      if (!error) {
        setReviews(reviews.filter(r => r.id !== reviewId));
        alert("Deleted!");
      }
    }
  };

  // --- BUY NOW LOGIC ---
  const handleBuyNow = () => {
    addToCart(product); // Cart mein daalo
    navigate('/checkout'); // Direct Checkout par bhejo
  };

  const averageRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 0;
  
  const whatsappNumber = "923554952450";
  const whatsappLink = product ? `https://wa.me/${whatsappNumber}?text=Hi, I want to order *${product.name}* (Price: Rs. ${product.price})` : "#";

  // Discount Calculation
  const discount = product?.old_price ? Math.round(((product.old_price - product.price) / product.old_price) * 100) : 0;
  const isOutOfStock = product?.stock <= 0;

  if (loading) return <div className="pt-40 text-center text-xl">Loading...</div>;
  if (!product) return <div className="pt-40 text-center text-xl">Product Not Found</div>;

  return (
    <div className="font-sans text-gray-900 pt-[120px] pb-20 container mx-auto px-6 md:px-12">
      
      <Helmet>
        <title>{product.name} | MegaMart</title>
        <meta name="description" content={`Buy ${product.name} for Rs. ${product.price}.`} />
      </Helmet>

      <Link to="/shop" className="flex items-center gap-2 text-gray-500 mb-8 hover:text-black transition">
        <ArrowLeft size={18} /> Back to Shop
      </Link>

      {/* --- MAIN PRODUCT LAYOUT --- */}
      <div className="flex flex-col md:flex-row gap-12 mb-20">
        
        {/* Left: IMAGE GALLERY */}
        <div className="w-full md:w-1/2">
          <div className="bg-gray-100 rounded-lg overflow-hidden h-[400px] md:h-[500px] shadow-sm border border-gray-200 mb-4 flex items-center justify-center relative">
            <img 
              src={mainImage || 'https://via.placeholder.com/500'} 
              alt={product.name} 
              className={`w-full h-full object-contain hover:scale-105 transition duration-500 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`} 
            />
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <span className="bg-red-600 text-white px-6 py-2 font-bold uppercase tracking-wider shadow-lg">Out of Stock</span>
              </div>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, index) => (
                <div 
                  key={index} 
                  onClick={() => setMainImage(img)} 
                  className={`w-20 h-20 rounded-md border-2 cursor-pointer overflow-hidden flex-shrink-0 transition-all ${mainImage === img ? 'border-[#84a93e] opacity-100' : 'border-gray-200 opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: DETAILS */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <span className="text-[#84a93e] font-bold uppercase tracking-widest text-sm mb-2">{product.category}</span>
          <h1 className="text-4xl font-serif font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-1 text-yellow-500 mb-6">
            <span className="font-bold text-xl mr-2 text-gray-800">{averageRating}</span>
            {[...Array(5)].map((_, i) => (<Star key={i} size={18} fill={i < Math.round(averageRating) ? "currentColor" : "none"} />))}
            <span className="text-gray-400 text-sm ml-2">({reviews.length} Reviews)</span>
          </div>

          {/* Price Section with Discount */}
          <div className="flex items-center gap-4 mb-6">
            <p className="text-3xl font-medium text-gray-900">Rs. {product.price}</p>
            {product.old_price && (
              <>
                <p className="text-xl text-gray-400 line-through">Rs. {product.old_price}</p>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-bold">-{discount}% OFF</span>
              </>
            )}
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed whitespace-pre-line">{product.description}</p>

          {!isOutOfStock ? (
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <button onClick={() => addToCart(product)} className="flex-1 bg-black text-white py-4 rounded-lg font-bold uppercase hover:bg-gray-800 transition flex items-center justify-center gap-2 shadow-lg">
                  <ShoppingBag size={20} /> Add to Cart
                </button>
                <button onClick={handleBuyNow} className="flex-1 bg-[#84a93e] text-white py-4 rounded-lg font-bold uppercase hover:bg-[#6e8f30] transition flex items-center justify-center gap-2 shadow-lg">
                  <Zap size={20} /> Buy Now
                </button>
              </div>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full bg-green-500 text-white py-4 rounded-lg font-bold uppercase hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-lg">
                <MessageCircle size={20} /> Order via WhatsApp
              </a>
            </div>
          ) : (
            <button disabled className="w-full bg-gray-300 text-gray-500 py-4 rounded-lg font-bold uppercase cursor-not-allowed">
              Out of Stock
            </button>
          )}

        </div>
      </div>

      {/* --- RELATED PRODUCTS --- */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-200 pt-16 mb-20">
          <h2 className="text-3xl font-serif font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {relatedProducts.map((item) => {
              // Discount Logic for Related Items
              const relDiscount = item.old_price ? Math.round(((item.old_price - item.price) / item.old_price) * 100) : 0;
              const relImage = item.images && item.images.length > 0 ? item.images[0] : (item.image || 'https://via.placeholder.com/300');

              return (
                <Link to={`/product/${item.id}`} key={item.id} className="group block relative">
                  <div className="bg-gray-100 h-64 rounded-lg overflow-hidden mb-4 border border-gray-200 relative">
                    <img 
                      src={relImage} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                    />
                    {relDiscount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">-{relDiscount}%</div>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-[#84a93e] transition line-clamp-1">{item.name}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-[#84a93e] font-medium">Rs. {item.price}</p>
                    {item.old_price && <p className="text-xs text-gray-400 line-through">Rs. {item.old_price}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* --- REVIEWS --- */}
      <div className="border-t border-gray-200 pt-16">
        <h2 className="text-3xl font-serif font-bold mb-8">Customer Reviews</h2>
        <div className="flex flex-col lg:flex-row gap-16">
          
          <div className="w-full lg:w-1/3 bg-gray-50 p-8 rounded-lg h-fit border border-gray-100">
            <h3 className="text-xl font-bold mb-6">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <input type="text" className="w-full border p-3 rounded focus:outline-[#84a93e]" placeholder="Your Name" value={reviewForm.user_name} onChange={(e) => setReviewForm({...reviewForm, user_name: e.target.value})} required />
              <div className="flex gap-1 text-yellow-500 cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={28} fill={star <= reviewForm.rating ? "currentColor" : "none"} onClick={() => setReviewForm({...reviewForm, rating: star})} />
                ))}
              </div>
              <textarea rows="4" className="w-full border p-3 rounded focus:outline-[#84a93e]" placeholder="Your Review" value={reviewForm.comment} onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})} required></textarea>
              <button disabled={submitting} className="w-full bg-[#84a93e] text-white py-3 rounded font-bold hover:bg-[#6e8f30]">
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>

          <div className="w-full lg:w-2/3 space-y-6">
            {reviews.length === 0 ? <p className="text-gray-500 italic text-center py-10 bg-gray-50 rounded">No reviews yet.</p> : reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-200 p-2 rounded-full"><User size={20} /></div>
                    <div>
                      <h4 className="font-bold text-gray-900">{review.user_name}</h4>
                      <div className="flex text-yellow-500 text-xs">{[...Array(5)].map((_, i) => (<Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />))}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                    {isAdmin && <button onClick={() => deleteReview(review.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>}
                  </div>
                </div>
                <p className="text-gray-600 ml-11">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;