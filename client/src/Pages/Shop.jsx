import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Search, ChevronDown, Star, ShoppingBag, Zap } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const Shop = () => {
  const [shopProducts, setShopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Watches",
    "Shoes",
    "Beauty",
    "Home",
    "Accessories",
    "Kids",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from("products").select("*");
      if (searchTerm) query = query.ilike("name", `%${searchTerm}%`);
      if (selectedCategory !== "All")
        query = query.eq("category", selectedCategory);
      let { data, error } = await query;
      if (!error) setShopProducts(data || []);
      setLoading(false);
    };
    const timer = setTimeout(() => fetchProducts(), 500);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="font-sans text-gray-900 pt-[100px]">
      <div className="relative h-[40vh] md:h-[100vh] w-full flex items-center justify-center bg-gray-900 mb-10">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000"
            alt="Shop Background"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <h1 className="relative z-10 text-4xl md:text-6xl font-bold text-white font-serif tracking-wide text-center px-4">
          Explore Our Collection
        </h1>
      </div>

      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-[#84a93e] transition"
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold border transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:border-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <section className="pb-24">
          {loading ? (
            <div className="text-center py-20 text-gray-500 text-xl">
              Searching...
            </div>
          ) : shopProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-lg">
              No products found.
            </div>
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

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const isOutOfStock = product.stock <= 0;
  const displayImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://via.placeholder.com/300";

  // --- DISCOUNT LOGIC ---
  const discount = product.old_price
    ? Math.round(
        ((product.old_price - product.price) / product.old_price) * 100
      )
    : 0;

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/checkout");
  };

  return (
    <div className="group relative flex flex-col h-full">
      <Link
        to={`/product/${product.id}`}
        className="block overflow-hidden rounded-lg border border-gray-100 mb-4 relative"
      >
        <div className="relative h-[350px] w-full bg-gray-100">
          <img
            src={displayImage}
            alt={product.name}
            className={`h-full w-full object-cover transition duration-700 group-hover:scale-110 ${
              isOutOfStock ? "opacity-50 grayscale" : ""
            }`}
          />

          {/* Discount Badge */}
          {discount > 0 && !isOutOfStock && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm z-10">
              -{discount}%
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <span className="bg-red-600 text-white px-4 py-2 font-bold text-sm uppercase tracking-wider shadow-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-col flex-grow">
        <div className="flex text-gray-300 mb-2 gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill="currentColor" />
          ))}
        </div>
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#84a93e] transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-3">{product.category}</p>

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-4">
          <p className="font-bold text-xl text-gray-900">Rs. {product.price}</p>
          {product.old_price && (
            <p className="text-sm text-gray-400 line-through">
              Rs. {product.old_price}
            </p>
          )}
        </div>

        {!isOutOfStock && (
          <div className="flex gap-3 mt-auto">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 bg-black text-white px-4 py-2.5 rounded text-sm font-bold hover:bg-gray-800 transition shadow-sm flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} /> Add
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-[#84a93e] text-white px-4 py-2.5 rounded text-sm font-bold hover:bg-[#6e8f30] transition shadow-sm flex items-center justify-center gap-2"
            >
              <Zap size={16} /> Buy Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
