import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [myItems, setMyItems] = useState([]);
  const [matches, setMatches] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchMyItems();
    fetchMatches();

    const socket = io('http://localhost:5000');
    socket.emit('join_user_room', user.id);

    socket.on('new_match', (data) => {
      setNotifications(prev => [data, ...prev]);
      fetchMatches(); // Refresh matches
    });

    return () => {
      socket.disconnect();
    };
  }, [user.id]);

  const fetchMyItems = async () => {
    try {
      const res = await api.get('/items/user/me');
      setMyItems(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMatches = async () => {
    try {
      const res = await api.get('/matches');
      setMatches(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-campus-dark">Welcome, {user.name}</h1>
        <Link to="/add-item" className="btn-primary">Report an Item</Link>
      </div>

      {notifications.length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded shadow-sm">
          <h3 className="font-bold text-blue-800">New Notifications</h3>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            {notifications.map((notif, i) => (
              <li key={i} className="text-blue-700">{notif.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-2xl font-bold border-b pb-4 mb-4 text-slate-800">My Items</h2>
          {myItems.length === 0 ? (
            <p className="text-slate-500 text-center py-4">You haven't reported any items yet.</p>
          ) : (
            <div className="space-y-4">
              {myItems.map(item => (
                <div key={item.id} className="flex justify-between items-center border p-4 rounded-lg bg-slate-50">
                  <div>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full font-bold uppercase ${item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} mb-2`}>
                      {item.type}
                    </span>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-sm text-slate-500">{format(new Date(item.date), 'MMM dd, yyyy')} - {item.location}</p>
                  </div>
                  <Link to={`/item/${item.id}`} className="text-campus-accent font-medium hover:underline">View</Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-bold border-b pb-4 mb-4 text-slate-800">Potential Matches</h2>
          {matches.length === 0 ? (
            <p className="text-slate-500 text-center py-4">No potential matches found yet.</p>
          ) : (
            <div className="space-y-4">
              {matches.map(match => (
                <div key={match.match_id} className="border p-4 rounded-lg bg-orange-50 border-orange-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-orange-200 text-orange-800 text-xs font-bold px-2 py-1 rounded">
                      Match Score: {Math.round(match.similarity_score * 100)}%
                    </span>
                    <span className="text-xs text-slate-500 uppercase">{match.status}</span>
                  </div>
                  <p className="text-sm my-2">
                    <span className="font-semibold text-red-600">Lost:</span> <Link to={`/item/${match.lost_item_id}`} className="hover:underline">{match.lost_item_title}</Link>
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold text-green-600">Found:</span> <Link to={`/item/${match.found_item_id}`} className="hover:underline">{match.found_item_title}</Link>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
