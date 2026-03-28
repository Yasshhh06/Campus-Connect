import { Link } from 'react-router-dom';
import { Search, Bell, ShieldCheck } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-20 py-10">
      {/* Hero Section */}
      <section className="text-center space-y-8 animate-fade-in-up">
        <h1 className="text-5xl md:text-6xl font-extrabold text-campus-dark tracking-tight">
          Lost something? <span className="text-campus-accent">Found it.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Campus Connect is the smartest way to report, find, and return lost items on your university campus using our AI-driven matching system.
        </p>
        <div className="flex justify-center flex-wrap gap-4 mt-8">
          <Link to="/add-item" className="btn-primary text-lg px-8 py-3 rounded-full">
            Report an Item
          </Link>
          <Link to="/items" className="btn-secondary text-lg px-8 py-3 rounded-full">
            Browse Lost & Found
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 py-10">
        <div className="card p-8 text-center hover:-translate-y-2 transition-transform duration-300">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-campus-blue">
            <Search size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-campus-dark">Smart Matching</h3>
          <p className="text-slate-600">Our system automatically matches lost items with found items based on descriptions, images, and categories.</p>
        </div>
        <div className="card p-8 text-center hover:-translate-y-2 transition-transform duration-300">
          <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-campus-teal">
            <Bell size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-campus-dark">Real-time Alerts</h3>
          <p className="text-slate-600">Get notified instantly when someone reports an item that matches what you've lost.</p>
        </div>
        <div className="card p-8 text-center hover:-translate-y-2 transition-transform duration-300">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-700">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-campus-dark">Secure Verification</h3>
          <p className="text-slate-600">Verified campus identities ensure a safe and trustworthy environment for exchanging items.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
