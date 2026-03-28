import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { Upload } from 'lucide-react';

const AddItem = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'lost',
    title: '',
    description: '',
    category: 'electronics',
    color: '',
    brand: '',
    date: '',
    location: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append('image', image);

    try {
      await api.post('/items', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Error creating item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="card p-8">
        <h1 className="text-3xl font-bold text-campus-dark mb-6 text-center">Report an Item</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              className={`flex-1 py-3 rounded-lg font-bold text-lg transition-colors border ${formData.type === 'lost' ? 'bg-red-500 text-white border-red-600' : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-50'}`}
              onClick={() => setFormData({ ...formData, type: 'lost' })}
            >
              I Lost Something
            </button>
            <button
              type="button"
              className={`flex-1 py-3 rounded-lg font-bold text-lg transition-colors border ${formData.type === 'found' ? 'bg-green-500 text-white border-green-600' : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-50'}`}
              onClick={() => setFormData({ ...formData, type: 'found' })}
            >
              I Found Something
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input type="text" name="title" required className="input-field" placeholder="e.g. Blue Hydro Flask" value={formData.title} onChange={handleChange} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea name="description" rows="3" className="input-field" placeholder="Provide as much detail as possible..." value={formData.description} onChange={handleChange}></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select name="category" className="input-field bg-white" value={formData.category} onChange={handleChange}>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="keys">Keys & Wallets</option>
                <option value="books">Books & Tech</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Color (Optional)</label>
              <input type="text" name="color" className="input-field" placeholder="e.g. Red" value={formData.color} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Brand (Optional)</label>
              <input type="text" name="brand" className="input-field" placeholder="e.g. Apple" value={formData.brand} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date {formData.type === 'lost' ? 'Lost' : 'Found'}</label>
              <input type="date" name="date" required className="input-field" value={formData.date} onChange={handleChange} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input type="text" name="location" required className="input-field" placeholder="e.g. Library 2nd Floor" value={formData.location} onChange={handleChange} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Upload Image</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative overflow-hidden group">
                <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleImageChange} />
                {preview ? (
                  <div className="relative">
                    <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded object-contain relative z-0" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                      <span className="text-white font-medium flex items-center"><Upload className="w-4 h-4 mr-2" /> Change Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 flex flex-col items-center">
                    <Upload className="w-10 h-10 text-slate-400 mb-3" />
                    <p className="text-slate-600 font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-4 text-lg font-bold" disabled={loading}>
            {loading ? 'Submitting...' : `Submit ${formData.type === 'lost' ? 'Lost' : 'Found'} Item`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
