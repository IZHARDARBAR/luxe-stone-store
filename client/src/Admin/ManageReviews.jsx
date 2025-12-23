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
    <div className="min-h-screen bg-gray-50 p-10">
      <Link to="/admin/dashboard" className="flex items-center gap-2 mb-6 text-gray-500 hover:text-black">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <MessageSquare /> Manage Reviews
      </h1>

      <div className="bg-white rounded shadow overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Rating</th>
              <th className="p-4 w-1/2">Comment</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 font-bold text-gray-800">{review.user_name}</td>
                <td className="p-4">
                  <div className="flex text-yellow-500 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                </td>
                <td className="p-4 text-gray-600 text-sm italic">"{review.comment}"</td>
                <td className="p-4">
                  <button 
                    onClick={() => handleDelete(review.id)}
                    className="bg-red-50 text-red-600 p-2 rounded hover:bg-red-600 hover:text-white transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reviews.length === 0 && <div className="p-10 text-center text-gray-500">No reviews found.</div>}
      </div>
    </div>
  );
};

export default ManageReviews;