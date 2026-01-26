import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useCart } from "../context/CartContext";
import {
  Star,
  ArrowLeft,
  MessageCircle,
  ShoppingBag,
  User,
  Trash2,
  Zap,
  Heart,
  Clock,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // New States
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  const [reviewForm, setReviewForm] = useState({
    user_name: "",
    rating: 5,
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const { addToCart } = useCart();
  const isAdmin = localStorage.getItem("isAdmin");

  useEffect(() => {
    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  // Flash Sale Timer Logic
  useEffect(() => {
    if (product?.sale_end) {
      const timer = setInterval(() => {
        const diff = new Date(product.sale_end) - new Date();
        if (diff <= 0) setTimeLeft("Expired");
        else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft(`${hours}h ${minutes}m left`);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [product]);

  const fetchProductData = async () => {
    setLoading(true);
    const { data: current } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (!current) {
      setLoading(false);
      return;
    }

    setProduct(current);
    if (current.images?.length > 0) setMainImage(current.images[0]);
    else setMainImage(current.image);

    if (current.sizes?.length > 0) setSelectedSize(current.sizes[0]);
    if (current.colors?.length > 0) setSelectedColor(current.colors[0]);

    const { data: revs } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", id)
      .order("created_at", { ascending: false });
    setReviews(revs || []);
    const { data: rel } = await supabase
      .from("products")
      .select("*")
      .eq("category", current.category)
      .neq("id", id)
      .limit(4);
    setRelatedProducts(rel || []);
    setLoading(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.user_name || !reviewForm.comment)
      return alert("Fill all fields");
    setSubmitting(true);
    const { error } = await supabase
      .from("reviews")
      .insert([{ ...reviewForm, product_id: id }]);
    if (!error) {
      alert("Review Submitted!");
      setReviewForm({ user_name: "", rating: 5, comment: "" });
      fetchProductData();
    }
    setSubmitting(false);
  };

  const deleteReview = async (reviewId) => {
    if (confirm("Delete review?")) {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);
      if (!error) {
        setReviews(reviews.filter((r) => r.id !== reviewId));
        alert("Deleted!");
      }
    }
  };

  const handleWishlist = () => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (!wishlist.find((p) => p.id === product.id)) {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      toast.success("Added to Wishlist!");
    } else {
      toast("Already in Wishlist!", { icon: "❤️" });
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...product, selectedSize, selectedColor });
  };

  const getStockStatus = () => {
    if (product.stock <= 0)
      return <span className="text-red-500 font-bold">Out of Stock</span>;
    if (product.stock < 5)
      return (
        <span className="text-orange-500 font-bold">
          Hurry! Only {product.stock} left
        </span>
      );
    return <span className="text-green-600 font-bold">In Stock</span>;
  };

  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(
        1,
      )
    : 0;
  const whatsappLink = product
    ? `https://wa.me/923554952450?text=Hi, I want to order *${product.name}* (Price: Rs. ${product.price})`
    : "#";
  const discount = product?.old_price
    ? Math.round(
        ((product.old_price - product.price) / product.old_price) * 100,
      )
    : 0;
  const isOutOfStock = product?.stock <= 0;

  if (loading || !product)
    return <div className="pt-40 text-center text-xl">Loading...</div>;

  return (
    <div className="font-sans text-gray-900 pt-[120px] pb-20 container mx-auto px-6 md:px-12">
      <Helmet>
        <title>{product.name} | MegaMart</title>
      </Helmet>
      <Link
        to="/shop"
        className="flex items-center gap-2 text-gray-500 mb-8 hover:text-black transition"
      >
        <ArrowLeft size={18} /> Back to Shop
      </Link>

      <div className="flex flex-col md:flex-row gap-12 mb-20">
        {/* IMAGE */}
        <div className="w-full md:w-1/2">
          <div className="bg-gray-100 rounded-lg overflow-hidden h-[500px] mb-4 flex items-center justify-center relative">
            <img
              src={mainImage || "https://via.placeholder.com/500"}
              alt={product.name}
              className="w-full h-full object-contain"
            />
            <button
              onClick={handleWishlist}
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:text-red-500"
            >
              <Heart />
            </button>
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                <span className="bg-red-600 text-white px-4 py-2 font-bold uppercase shadow-lg">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {product.images?.map((img, i) => (
              <div
                key={i}
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 border-2 cursor-pointer rounded ${mainImage === img ? "border-green-500" : ""}`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div className="w-full md:w-1/2">
          <span className="text-gray-400 text-sm uppercase">
            {product.category}
          </span>
          <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-1 text-yellow-500 mb-4">
            <span className="font-bold text-xl mr-2 text-gray-800">
              {averageRating}
            </span>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                fill={i < Math.round(averageRating) ? "currentColor" : "none"}
              />
            ))}
            <span className="text-gray-400 text-sm ml-2">
              ({reviews.length} Reviews)
            </span>
          </div>

          <p className="mb-4 text-sm">{getStockStatus()}</p>
          {timeLeft && timeLeft !== "Expired" && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4 inline-flex items-center gap-2 text-sm font-bold">
              <Clock size={16} /> Flash Sale ends in: {timeLeft}
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <p className="text-3xl font-bold text-gray-900">
              Rs. {product.price}
            </p>
            {product.old_price && (
              <>
                <p className="text-xl text-gray-400 line-through">
                  Rs. {product.old_price}
                </p>
                <span className="bg-red-500 text-white px-2 rounded text-sm">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {/* Variants */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-4">
              <p className="font-bold mb-2">Size:</p>
              <div className="flex gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 border rounded ${selectedSize === s ? "bg-black text-white" : ""}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <p className="font-bold mb-2">Color:</p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-2 border rounded ${selectedColor === c ? "bg-black text-white" : ""}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 bg-black text-white py-3 rounded font-bold disabled:bg-gray-400"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  handleAddToCart();
                  navigate("/checkout");
                }}
                disabled={isOutOfStock}
                className="flex-1 bg-green-600 text-white py-3 rounded font-bold disabled:bg-gray-400"
              >
                Buy Now
              </button>
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              className="w-full border-2 border-green-500 text-green-600 py-3 rounded font-bold text-center"
            >
              Order via WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-gray-200 pt-16">
        <h2 className="text-3xl font-serif font-bold mb-8">Customer Reviews</h2>
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-1/3 bg-gray-50 p-8 rounded-lg h-fit border border-gray-100">
            <h3 className="text-xl font-bold mb-6">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <input
                className="w-full border p-3 rounded"
                placeholder="Your Name"
                value={reviewForm.user_name}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, user_name: e.target.value })
                }
                required
              />
              <div className="flex gap-1 text-yellow-500 cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={28}
                    fill={star <= reviewForm.rating ? "currentColor" : "none"}
                    onClick={() =>
                      setReviewForm({ ...reviewForm, rating: star })
                    }
                  />
                ))}
              </div>
              <textarea
                rows="4"
                className="w-full border p-3 rounded"
                placeholder="Review"
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, comment: e.target.value })
                }
                required
              ></textarea>
              <button
                disabled={submitting}
                className="w-full bg-[#84a93e] text-white py-3 rounded font-bold"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
          <div className="w-full lg:w-2/3 space-y-6">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center">No reviews yet.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-200 p-2 rounded-full">
                        <User size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold">{review.user_name}</h4>
                        <div className="flex text-yellow-500 text-xs">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              fill={i < review.rating ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                      {isAdmin && (
                        <button
                          onClick={() => deleteReview(review.id)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 ml-11">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetail;
