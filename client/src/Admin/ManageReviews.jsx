import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Trash2, ArrowLeft, Star, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('isAdmin')) navigate('/admin');
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    let { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setReviews(data);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this review permanently?")) {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (!error) {
        setReviews(reviews.filter(r => r.id !== id));
        alert("Review Deleted!");
      }
    }
  };

  return (
    // Change 1: Responsive Padding
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      
      <Link to="/admin/dashboard" className="flex items-center gap-2 mb-6 text-gray-500 hover:text-black transition">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3 text-gray-800">
        <MessageSquare className="text-[#84a93e]" /> Manage Reviews
      </h1>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        
        {/* Change 2: Horizontal Scrolling Wrapper for Mobile */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]"> {/* min-w-900px taake columns tight na hon */}
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600">Customer</th>
                <th className="p-4 font-semibold text-gray-600">Rating</th>
                <th className="p-4 font-semibold text-gray-600 w-1/2">Comment</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(review.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-bold text-gray-800 whitespace-nowrap">
                    {review.user_name}
                  </td>
                  <td className="p-4">
                    <div className="flex text-yellow-500 text-xs w-max">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 text-sm italic min-w-[300px]">
                    "{review.comment}"
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleDelete(review.id)}
                      className="bg-red-50 text-red-600 p-2 rounded hover:bg-red-600 hover:text-white transition shadow-sm border border-red-100"
                      title="Delete Review"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reviews.length === 0 && (
          <div className="p-10 text-center text-gray-500">No reviews found.</div>
        )}
      </div>
    </div>
  );
};

export default ManageReviews;