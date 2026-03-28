import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { format } from 'date-fns';
import { Search, MapPin, Calendar, Tag } from 'lucide-react';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    search: ''
  });

  useEffect(() => {
    fetchItems();
  }, [filters.type, filters.category]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let url = '/items?status=active';
      if (filters.type) url += `&type=${filters.type}`;
      if (filters.category) url += `&category=${filters.category}`;
      const res = await api.get(url);
      setItems(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
    item.location.toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <div className="py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-campus-dark">Lost & Found Directory</h1>
          <p className="text-slate-600 text-lg">Browse recently reported items ending up in the campus directory.</p>
        </div>
      </div>

      <div className="card p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-white shadow-sm border border-slate-200">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by title or location..." 
            className="input-field pl-10 bg-slate-50 border-transparent focus:bg-white"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>
        <div>
          <select 
            className="input-field bg-slate-50 border-transparent focus:bg-white"
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
          >
            <option value="">All Types (Lost & Found)</option>
            <option value="lost">Lost Items Only</option>
            <option value="found">Found Items Only</option>
          </select>
        </div>
        <div>
          <select 
            className="input-field bg-slate-50 border-transparent focus:bg-white"
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="keys">Keys & Wallets</option>
            <option value="books">Books & Tech</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xl font-medium text-slate-500 animate-pulse">Loading items...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 card bg-white border-dashed border-2">
          <p className="text-2xl text-slate-500 font-medium">No items found matching your criteria.</p>
          <button onClick={() => setFilters({type:'', category:'', search:''})} className="text-campus-accent hover:underline mt-2">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <Link to={`/item/${item.id}`} key={item.id} className="card flex flex-col group h-full hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="relative h-48 w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                {item.image_url ? (
                  <img src={`http://localhost:5000${item.image_url}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-slate-400 group-hover:scale-110 transition-transform duration-500">No Image provided</div>
                )}
                <div className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded shadow-sm uppercase ${item.type === 'lost' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                  {item.type}
                </div>
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="font-bold text-xl text-slate-800 mb-2 line-clamp-1">{item.title}</h3>
                
                <div className="space-y-2 mt-auto text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="line-clamp-1">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>{format(new Date(item.date), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="capitalize">{item.category}</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center text-sm">
                <span className="text-slate-500">By {item.user_name}</span>
                <span className="text-campus-accent font-semibold group-hover:underline flex items-center gap-1">View Details &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemList;
