import React from 'react';
import { Link } from 'react-router-dom';
import { Gem, Users, Lightbulb, ShieldCheck, Smile, Layers, CheckCircle, Quote } from 'lucide-react';

const About = () => {
  return (
    <div className="font-sans text-gray-900">
      
      {/* =========================================
          1. HEADER BANNER
      ========================================= */}
      <div className="relative h-[100vh] w-full flex items-center justify-center text-center text-white">
        <div className="absolute inset-0">
          {/* New Modern Office Image */}
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000" 
            alt="About Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 px-4 mt-16">
          <h4 className="uppercase tracking-[0.2em] text-sm md:text-base mb-4 font-medium text-gray-200">
            About Us
          </h4>
          <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
            Building Trust <br /> Since 2025.
          </h1>
        </div>
      </div>
      {/* =========================================
          2. OUR STORY & FOUNDER
      ========================================= */}
      <section className="container mx-auto px-6 md:px-12 py-24">
        <div className="flex flex-col md:flex-row items-center gap-16">
          
          {/* Left: Founder Image */}
          <div className="w-full md:w-1/2 relative">
            <div className="absolute top-4 left-4 w-full h-full border-2 border-[#84a93e] rounded-lg transform translate-x-2 translate-y-2 z-0"></div>
            <img 
              src="/Izhar.png"
              alt="Izhar Darbar" 
              className="w-full h-auto rounded-lg shadow-xl object-cover relative z-10 aspect-[4/5]"
            />
          </div>

          {/* Right: Content */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-gray-900 leading-tight">
              A Vision Born in 2025.
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed text-lg">
              What started as a vision in **2025** has now grown into a premium destination for quality products. 
              **Luxe Stone** was founded with a simple mission: to make high-quality Fashion, Electronics, and Accessories accessible to everyone in Pakistan.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              We don't just sell products; we deliver trust. From our warehouse to your doorstep, every step is handled with care to ensure you get the best experience.
            </p>
            
            <div className="border-t border-gray-200 my-8"></div>

            {/* CEO Quote Section */}
            <div className="flex flex-col gap-4 bg-gray-50 p-6 rounded-lg border-l-4 border-[#84a93e]">
              <p className="italic text-gray-700 text-lg font-medium">
                "Our goal is not just to build a store, but to build a legacy of trust and quality. We are here to serve you with the best."
              </p>
              
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <h5 className="font-bold text-gray-900 text-xl">Izhar Darbar</h5>
                  <p className="text-sm text-[#84a93e] uppercase font-bold tracking-wide">CEO & Founder</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================
          3. CORE VALUES
      ========================================= */}
      <section className="bg-[#f4f7eb] py-24">
        <div className="container mx-auto px-6 md:px-12">
          
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Why Shop With Us?
            </h2>
            <p className="text-gray-600">We believe in values that matter to you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <ValueCard 
              icon={<Gem />} 
              title="Premium Quality" 
              desc="We handpick every product to ensure it meets our high standards of excellence."
            />
            <ValueCard 
              icon={<Users />} 
              title="Customer First" 
              desc="Your satisfaction is our priority. Our support team is always here to help."
            />
            <ValueCard 
              icon={<Lightbulb />} 
              title="Innovation" 
              desc="Bringing the latest trends in fashion and technology directly to you."
            />
            <ValueCard 
              icon={<ShieldCheck />} 
              title="Secure Shopping" 
              desc="Your data and payments are 100% secure with our advanced systems."
            />
            <ValueCard 
              icon={<Smile />} 
              title="Fast Delivery" 
              desc="We ensure your order reaches you safely and on time, anywhere in Pakistan."
            />
            <ValueCard 
              icon={<Layers />} 
              title="Wide Variety" 
              desc="From Electronics to Fashion, find everything you need in one place."
            />
          </div>

        </div>
      </section>

      {/* =========================================
          4. BOTTOM CTA
      ========================================= */}
      <section className="relative h-[400px] w-full flex items-center justify-center text-center text-white">
        <div className="absolute inset-0">
          <img 
            src="/aboutFooter.png" 
            alt="CTA Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 px-4 max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Join the Luxe Stone Family
          </h2>
          <p className="text-lg text-gray-200 mb-8">
            Experience the best online shopping in Pakistan. Quality you can trust.
          </p>
          <Link to="/shop">
            <button className="bg-[#84a93e] text-white px-10 py-3 rounded-full font-bold uppercase hover:bg-[#6e8f30] transition shadow-lg transform hover:scale-105">
              Start Shopping
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
};

// Helper Component
const ValueCard = ({ icon, title, desc }) => (
  <div className="flex gap-4 items-start bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
    <div className="bg-black text-white p-3 rounded-full shrink-0">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default About;