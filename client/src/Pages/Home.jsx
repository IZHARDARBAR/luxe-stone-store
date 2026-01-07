import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  ArrowRight,
  Star,
  Truck,
  ShieldCheck,
  Box,
  CreditCard,
} from "lucide-react";

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [saleProduct, setSaleProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Trending
      const { data: trending } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .limit(4);
      setTrendingProducts(trending || []);

      // Fetch Sale
      const { data: sale } = await supabase
        .from("products")
        .select("*")
        .eq("on_sale", true)
        .limit(1)
        .single();
      setSaleProduct(sale);
    };
    fetchData();
  }, []);

  // --- FLASH SALE IMAGE LOGIC ---
  const saleImage =
    saleProduct?.images && saleProduct.images.length > 0
      ? saleProduct.images[0]
      : saleProduct?.image;

  return (
    <div className="font-sans text-gray-900">
      {/* 1. HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <video
            src="/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 text-white px-4 max-w-4xl mx-auto mt-16">
          <p className="uppercase tracking-[0.3em] text-sm md:text-base mb-4 font-medium text-gray-200">
            Welcome to LUXE STONE
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            One Stop Shop for <br /> Everything You Need.
          </h1>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            From Electronics to Fashion, discover premium quality products at
            the best prices in Pakistan.
          </p>
          <Link to="/shop">
            <button className="bg-[#84a93e] text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-[#6e8f30] transition shadow-lg transform hover:scale-105">
              Start Shopping
            </button>
          </Link>
        </div>
      </section>

      {/* 
          2. FEATURES SECTION (UPDATED FOR MOBILE) 
          Change: 'grid-cols-1' ko hata kar 'grid-cols-2' kar diya hai.
          Mobile pe ab 2 dikhenge, Laptop pe 4 (md:grid-cols-4).
      */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <FeatureItem
            icon={<CreditCard />}
            title="Secure Payment"
            sub="COD & Bank Transfer"
          />
          <FeatureItem
            icon={<Truck />}
            title="Fast Delivery"
            sub="All over Pakistan"
          />
          <FeatureItem
            icon={<Box />}
            title="Easy Returns"
            sub="7 Days Checking"
          />
          <FeatureItem
            icon={<ShieldCheck />}
            title="Verified Products"
            sub="100% Original"
          />
        </div>
      </section>

      {/* 3. TRENDING PRODUCTS */}
      <section className="py-20 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-gray-900">
            Trending Now
          </h2>
          <div className="w-16 h-1 bg-[#84a93e] mx-auto mt-4 rounded"></div>
        </div>

        {trendingProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Check back later for trending items.
          </p>
        )}
      </section>

      {/* 4. FLASH SALE BANNER */}
      {saleProduct && (
        <section className="relative py-28 bg-gray-900 text-white text-center">
          <div className="absolute inset-0 z-0">
            <img
              src={saleImage || "https://via.placeholder.com/1200"}
              alt="Flash Sale"
              className="w-full h-full object-cover opacity-30 blur-sm"
            />
          </div>
          <div className="relative z-10 px-6">
            <span className="bg-red-600 text-white px-4 py-1 uppercase text-xs font-bold tracking-widest mb-4 inline-block">
              Flash Sale
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              {saleProduct.name}
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {saleProduct.description
                ? saleProduct.description.slice(0, 100)
                : ""}
              ...
            </p>
            <Link to={`/product/${saleProduct.id}`}>
              <button className="border-2 border-white px-10 py-3 uppercase tracking-widest font-bold hover:bg-white hover:text-black transition">
                Buy Now - Rs. {saleProduct.price}
              </button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

// --- HELPERS ---
const FeatureItem = ({ icon, title, sub }) => (
  <div className="flex flex-col items-center text-center p-4">
    <div className="mb-3 text-black bg-[#f4f7eb] p-3 rounded-full">
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <h3 className="font-bold text-sm md:text-lg text-gray-900">{title}</h3>
    <p className="text-gray-500 text-xs md:text-sm mt-1">{sub}</p>
  </div>
);

// --- PRODUCT CARD ---
const ProductCard = ({ product }) => {
  const displayImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : product.image;

  return (
    <Link to={`/product/${product.id}`} className="group relative block">
      <div className="relative h-[350px] w-full overflow-hidden bg-gray-100 rounded-lg">
        <img
          src={displayImage || "https://via.placeholder.com/300"}
          alt={product.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
      </div>
      <div className="mt-5 text-center">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
          {product.name}
        </h3>
        <p className="mt-2 text-lg font-semibold text-[#84a93e]">
          Rs. {product.price}
        </p>
      </div>
    </Link>
  );
};

export default Home;
