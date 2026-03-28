import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';
import { Mail, Trash2, CheckCircle, ArrowLeft } from 'lucide-react';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const res = await api.get(`/items/${id}`);
      setItem(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (window.confirm('Are you sure you want to mark this item as claimed/resolved?')) {
      try {
        await api.put(`/items/${id}/claim`);
        fetchItem();
      } catch (error) {
        console.error(error);
        alert('Error updating item');
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/items/${id}`);
        navigate('/items');
      } catch (error) {
        console.error(error);
        alert('Error deleting item');
      }
    }
  };

  if (loading) return <div className="text-center py-20 text-xl font-medium text-slate-500 animate-pulse">Loading item details...</div>;
  if (!item) return <div className="text-center py-20 text-2xl font-bold text-slate-700">Item not found.</div>;

  const isOwnerOrAdmin = user && (user.id === item.user_id || user.role === 'admin');

  return (
    <div className="max-w-4xl mx-auto py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-campus-blue hover:text-campus-accent font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <div className="card overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="bg-slate-100 flex items-center justify-center p-8 min-h-[300px]">
            {item.image_url ? (
              <img src={`http://localhost:5000${item.image_url}`} alt={item.title} className="max-w-full max-h-[400px] object-contain rounded drop-shadow-md" />
            ) : (
              <div className="text-slate-400 font-medium text-lg">No Image Provided</div>
            )}
          </div>
          <div className="p-8 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm ${item.type === 'lost' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                {item.type}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${item.status === 'active' ? 'border-green-500 text-green-600 bg-green-50' : 'border-slate-500 text-slate-600 bg-slate-50'}`}>
                {item.status.toUpperCase()}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">{item.title}</h1>
            <p className="text-slate-500 mb-6 flex items-center gap-2">
              Reported by <span className="font-semibold text-slate-700">{item.user_name}</span> on {format(new Date(item.created_at), 'MMM dd, yyyy')}
            </p>

            <div className="space-y-4 mb-8 flex-grow">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Description</h3>
                <p className="text-slate-700 whitespace-pre-line bg-slate-50 p-4 rounded border border-slate-100">{item.description || 'No description provided.'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Category</span>
                  <span className="font-medium capitalize">{item.category}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date</span>
                  <span className="font-medium">{format(new Date(item.date), 'MMM dd, yyyy')}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</span>
                  <span className="font-medium">{item.location}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-100 flex flex-col gap-1">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Features</span>
                  <span className="font-medium">{item.color && `${item.color} `}{item.brand}</span>
                </div>
              </div>
            </div>

            {user && user.id !== item.user_id && item.status === 'active' && (
              <div className="mt-auto">
                <a href={`mailto:${item.user_email}?subject=Campus Connect: Regarding your ${item.type} item "${item.title}"`} className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-lg">
                  <Mail className="w-5 h-5" /> Contact {item.user_name}
                </a>
              </div>
            )}

            {!user && (
              <p className="text-sm text-center text-slate-500 mt-auto bg-slate-50 py-3 rounded border border-slate-200">
                Please <a href="/login" className="text-campus-blue font-semibold hover:underline">log in</a> to contact the reporter.
              </p>
            )}
            
            {isOwnerOrAdmin && (
              <div className="flex gap-4 mt-6 pt-6 border-t border-slate-200">
                {item.status === 'active' && (
                  <button onClick={handleClaim} className="flex-1 bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700 transition flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Mark as Claimed
                  </button>
                )}
                <button onClick={handleDelete} className="flex-1 bg-red-600 text-white py-2 rounded font-medium hover:bg-red-700 transition flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" /> Delete Post
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
