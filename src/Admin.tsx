import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { X, Plus, Save, Trash2, Home } from 'lucide-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Website {
  id: string;
  description: string;
  url: string;
  order_index: number;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [websites, setWebsites] = useState<Website[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newWebsite, setNewWebsite] = useState({ description: '', url: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchWebsites();
    }
  }, []);

  const fetchWebsites = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('websites')
      .select('*')
      .order('order_index', { ascending: false });

    if (error) {
      setError('Failed to load websites');
      console.error(error);
    } else {
      setWebsites(data || []);
    }
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      fetchWebsites();
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleAdd = async () => {
    if (!newWebsite.description || !newWebsite.url) {
      setError('Please fill in both fields');
      return;
    }

    const maxOrder = Math.max(...websites.map(w => w.order_index), 0);

    const { error } = await supabase
      .from('websites')
      .insert([{
        description: newWebsite.description,
        url: newWebsite.url,
        order_index: maxOrder + 1
      }]);

    if (error) {
      setError('Failed to add website');
      console.error(error);
    } else {
      setNewWebsite({ description: '', url: '' });
      setError('');
      fetchWebsites();
    }
  };

  const handleUpdate = async (id: string, description: string, url: string) => {
    const { error } = await supabase
      .from('websites')
      .update({ description, url })
      .eq('id', id);

    if (error) {
      setError('Failed to update website');
      console.error(error);
    } else {
      setEditingId(null);
      setError('');
      fetchWebsites();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this website?')) return;

    const { error } = await supabase
      .from('websites')
      .delete()
      .eq('id', id);

    if (error) {
      setError('Failed to delete website');
      console.error(error);
    } else {
      setError('');
      fetchWebsites();
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
          <div className="flex gap-3">
            <a
              href="/"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Home size={18} />
              Home
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Add New Website</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <input
                type="text"
                value={newWebsite.description}
                onChange={(e) => setNewWebsite({ ...newWebsite, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Flight Simulator"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newWebsite.url}
                  onChange={(e) => setNewWebsite({ ...newWebsite, url: e.target.value })}
                  className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
                <button
                  onClick={handleAdd}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Manage Websites ({websites.length})
          </h2>

          {loading ? (
            <p className="text-slate-400 text-center py-8">Loading...</p>
          ) : (
            <div className="space-y-3">
              {websites.map((website) => (
                <div
                  key={website.id}
                  className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 hover:border-slate-500 transition-colors"
                >
                  {editingId === website.id ? (
                    <EditForm
                      website={website}
                      onSave={handleUpdate}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">
                          {website.description}
                        </h3>
                        <a
                          href={website.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 text-sm hover:text-blue-400 truncate block"
                        >
                          {website.url}
                        </a>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingId(website.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Save size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(website.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EditForm({
  website,
  onSave,
  onCancel
}: {
  website: Website;
  onSave: (id: string, description: string, url: string) => void;
  onCancel: () => void;
}) {
  const [description, setDescription] = useState(website.description);
  const [url, setUrl] = useState(website.url);

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          URL
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <X size={16} />
          Cancel
        </button>
        <button
          onClick={() => onSave(website.id, description, url)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Save size={16} />
          Save
        </button>
      </div>
    </div>
  );
}
