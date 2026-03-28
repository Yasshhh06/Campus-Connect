import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddItem from './pages/AddItem';
import ItemList from './pages/ItemList';
import ItemDetails from './pages/ItemDetails';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/items" element={<ItemList />} />
            <Route path="/item/:id" element={<ItemDetails />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-item" element={<AddItem />} />
            </Route>
          </Routes>
        </main>
        <footer className="bg-campus-dark text-white py-6 text-center">
          <p>&copy; {new Date().getFullYear()} Campus Connect. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
