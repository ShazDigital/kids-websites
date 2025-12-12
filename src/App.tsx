import { useState, useEffect } from 'react';
import { RefreshCw, X, Star, Globe } from 'lucide-react';

// Edge function URL for fetching Google Sheet data
const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-websites`;

// Fallback sample data if sheet fails to load
const FALLBACK_DATA = [
  { description: 'Fly a plane in your browser', url: 'geo-fs.com' },
  { description: 'Draw with physics and gravity', url: 'physicssketchpad.com' },
  { description: 'Make music with falling sand', url: 'sandspiel.club' },
  { description: 'Play with virtual slime', url: 'slime-simulator.com' },
  { description: 'Explore a weird virtual museum', url: 'savethesounds.info' }
];

type WebsiteItem = {
  description: string;
  url: string;
  clicks?: number;
};

function App() {
  const [items, setItems] = useState<WebsiteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [sortByClicks, setSortByClicks] = useState(false);
  const [partyMode, setPartyMode] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(false);

    try {
      const response = await fetch(EDGE_FUNCTION_URL);
      if (!response.ok) throw new Error('Failed to fetch');

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error('Invalid response from server');
      }

      const parsed = result.data as WebsiteItem[];

      // Load click counts from localStorage
      const clicks = JSON.parse(localStorage.getItem('bodacious-clicks') || '{}');
      const itemsWithClicks = parsed.map(item => ({
        ...item,
        clicks: clicks[item.url] || 0
      }));

      setItems(itemsWithClicks.reverse()); // Newest first
    } catch (err) {
      console.error('Failed to load sheet:', err);
      setError(true);
      setItems(FALLBACK_DATA);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClick = (url: string) => {
    // Track click
    const clicks = JSON.parse(localStorage.getItem('bodacious-clicks') || '{}');
    clicks[url] = (clicks[url] || 0) + 1;
    localStorage.setItem('bodacious-clicks', JSON.stringify(clicks));

    // Update state
    setItems(prev => prev.map(item =>
      item.url === url ? { ...item, clicks: clicks[url] } : item
    ));

    // Open link
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  const getIcon = (description: string) => {
    const lower = description.toLowerCase();

    if (lower.includes('fly') || lower.includes('flight') || lower.includes('plane')) {
      return <span className="text-2xl">✈️</span>;
    }
    if (lower.includes('space') || lower.includes('rocket') || lower.includes('orbit')) {
      return <span className="text-2xl">🚀</span>;
    }
    if (lower.includes('music') || lower.includes('sound') || lower.includes('audio') || lower.includes('song')) {
      return <span className="text-2xl">🎵</span>;
    }
    if (lower.includes('draw') || lower.includes('paint') || lower.includes('art') || lower.includes('sketch')) {
      return <span className="text-2xl">🎨</span>;
    }
    if (lower.includes('game') || lower.includes('play')) {
      return <span className="text-2xl">🎮</span>;
    }
    if (lower.includes('physics') || lower.includes('science') || lower.includes('experiment')) {
      return <span className="text-2xl">🧪</span>;
    }
    if (lower.includes('photo') || lower.includes('camera') || lower.includes('picture')) {
      return <span className="text-2xl">📷</span>;
    }
    if (lower.includes('fast') || lower.includes('speed') || lower.includes('quick') || lower.includes('zap')) {
      return <span className="text-2xl">⚡</span>;
    }
    if (lower.includes('world') || lower.includes('globe') || lower.includes('map') || lower.includes('earth')) {
      return <span className="text-2xl">🌍</span>;
    }
    if (lower.includes('tool') || lower.includes('build') || lower.includes('make') || lower.includes('create')) {
      return <span className="text-2xl">🔧</span>;
    }
    if (lower.includes('idea') || lower.includes('brain') || lower.includes('think') || lower.includes('light')) {
      return <span className="text-2xl">💡</span>;
    }
    if (lower.includes('target') || lower.includes('aim') || lower.includes('goal')) {
      return <span className="text-2xl">🎯</span>;
    }
    if (lower.includes('time') || lower.includes('clock') || lower.includes('timer')) {
      return <span className="text-2xl">⏰</span>;
    }
    if (lower.includes('love') || lower.includes('heart') || lower.includes('like')) {
      return <span className="text-2xl">❤️</span>;
    }
    if (lower.includes('win') || lower.includes('trophy') || lower.includes('champion') || lower.includes('prize')) {
      return <span className="text-2xl">🏆</span>;
    }
    if (lower.includes('read') || lower.includes('book') || lower.includes('story') || lower.includes('text')) {
      return <span className="text-2xl">📖</span>;
    }
    if (lower.includes('relax') || lower.includes('chill') || lower.includes('coffee') || lower.includes('calm')) {
      return <span className="text-2xl">☕</span>;
    }
    if (lower.includes('animal') || lower.includes('pet') || lower.includes('creature')) {
      return <span className="text-2xl">🐾</span>;
    }
    if (lower.includes('food') || lower.includes('eat') || lower.includes('cook')) {
      return <span className="text-2xl">🍕</span>;
    }
    if (lower.includes('robot') || lower.includes('ai') || lower.includes('bot')) {
      return <span className="text-2xl">🤖</span>;
    }
    if (lower.includes('alien') || lower.includes('ufo')) {
      return <span className="text-2xl">👽</span>;
    }
    if (lower.includes('dinosaur') || lower.includes('dino')) {
      return <span className="text-2xl">🦕</span>;
    }
    if (lower.includes('fire') || lower.includes('flame')) {
      return <span className="text-2xl">🔥</span>;
    }
    if (lower.includes('water') || lower.includes('ocean') || lower.includes('sea')) {
      return <span className="text-2xl">🌊</span>;
    }
    if (lower.includes('star') || lower.includes('sky')) {
      return <span className="text-2xl">⭐</span>;
    }
    if (lower.includes('color') || lower.includes('rainbow')) {
      return <span className="text-2xl">🌈</span>;
    }

    return <span className="text-2xl">✨</span>;
  };

  const triggerPartyMode = () => {
    setPartyMode(true);
    setTimeout(() => setPartyMode(false), 3000);
  };

  const displayItems = sortByClicks
    ? [...items].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    : items;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-x-hidden">
      {/* Tron grid background */}
      <div className="tron-grid pointer-events-none fixed inset-0 z-0" />

      {/* Subtle scanline overlay */}
      <div className="scanlines pointer-events-none fixed inset-0 z-50 opacity-[0.03]" />

      {/* Decorative neon shapes */}
      <div className="fixed top-20 right-10 w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 opacity-15 blur-2xl animate-float" />
      <div className="fixed bottom-32 left-20 w-24 h-24 bg-gradient-to-br from-teal-500 to-emerald-600 opacity-15 blur-2xl animate-float-delayed" />

      {/* Party mode emojis */}
      {partyMode && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-50px',
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 1}s`
              }}
            >
              {['🎉', '🎮', '🦄'][Math.floor(Math.random() * 3)]}
            </div>
          ))}
        </div>
      )}

      {/* Ticker */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 text-white py-2 overflow-hidden relative z-10">
        <div className="ticker-content whitespace-nowrap">
          <span className="ticker-item">Fly a plane</span>
          <span className="ticker-item">Draw with physics</span>
          <span className="ticker-item">Make music</span>
          <span className="ticker-item">Virtual slime</span>
          <span className="ticker-item">Weird museum</span>
          <span className="ticker-item">Cure boredom</span>
          <span className="ticker-item">Flight simulator</span>
          <span className="ticker-item">Falling sand</span>
          <span className="ticker-item">Goofy websites</span>
          <span className="ticker-item">Brain candy</span>
          <span className="ticker-item">Tiny instruments</span>
          <span className="ticker-item">No homework</span>
          <span className="ticker-item">Weird internet</span>
          <span className="ticker-item">Click everything</span>
          <span className="ticker-item">Explore freely</span>
          <span className="ticker-item">Pure fun</span>
          <span className="ticker-item">Fly a plane</span>
          <span className="ticker-item">Draw with physics</span>
          <span className="ticker-item">Make music</span>
          <span className="ticker-item">Virtual slime</span>
          <span className="ticker-item">Weird museum</span>
          <span className="ticker-item">Cure boredom</span>
        </div>
      </div>

      {/* Header */}
      <header className="text-center py-12 px-4 relative z-10">
        <div className="flex justify-end max-w-6xl mx-auto mb-4">
          <button
            onClick={triggerPartyMode}
            className="text-xs px-3 py-1 bg-white border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-900 hover:text-white transition-all"
          >
            PARTY MODE
          </button>
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-3 tracking-tight retro-title pixel-font">
          Fun Websites for Kids
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 font-medium mb-2">
          Interesting Websites. Part Learning, Part Creative, Part Cure Boredom
        </p>
        <p className="text-sm md:text-base text-gray-600 italic">
          CNN Says: Fun For Kids, and A.D.D Creatives Bored At Work
        </p>
      </header>

      {/* Error banner */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 mb-6 relative z-10">
          <div className="bg-yellow-50 border-2 border-yellow-200 p-4 text-center">
            <p className="text-yellow-800 text-sm">
              ⚠️ Using sample links (sheet unreachable)
            </p>
          </div>
        </div>
      )}

      {/* Sort toggle */}
      <div className="max-w-4xl mx-auto px-4 mb-6 flex justify-center gap-3 relative z-10">
        <button
          onClick={() => setSortByClicks(false)}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            !sortByClicks
              ? 'bg-gray-900 text-white shadow-lg'
              : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300'
          }`}
        >
          Newest First
        </button>
        <button
          onClick={() => setSortByClicks(true)}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            sortByClicks
              ? 'bg-gray-900 text-white shadow-lg'
              : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300'
          }`}
        >
          <Star className="w-4 h-4 inline mr-1" />
          Most Clicked
        </button>
      </div>

      {/* Gallery Grid */}
      <main className="max-w-6xl mx-auto px-4 pb-20 relative z-10">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center">
              <Globe className="w-16 h-16 text-orange-500 animate-spin retro-globe" strokeWidth={1.5} />
            </div>
            <p className="text-gray-500 mt-6 font-medium animate-pulse">Loading bodacious sites...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayItems.map((item, index) => (
              <div
                key={index}
                className="gallery-card bg-white p-6 border-2 border-gray-200 hover:border-amber-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 group-hover:scale-110 transition-transform pixel-icon">
                    {getIcon(item.description)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 font-medium leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleClick(item.url)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-95"
                >
                  Open
                </button>
                {item.clicks ? (
                  <p className="text-xs text-gray-400 text-center mt-2">
                    {item.clicks} {item.clicks === 1 ? 'click' : 'clicks'}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-gray-200 bg-white/80 backdrop-blur-sm py-6 relative z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAbout(true)}
              className="text-sm text-gray-600 hover:text-orange-600 font-medium transition-colors"
            >
              About
            </button>
            <span className="text-gray-300">•</span>
            <p className="text-xs text-gray-400">
              Made with ✨ for curious minds
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="text-xs">Refresh</span>
          </button>
        </div>
      </footer>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white p-8 max-w-md w-full shadow-2xl border-4 border-amber-200 animate-scale-in">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">About This Site</h2>
              <button
                onClick={() => setShowAbout(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>
                <strong className="text-gray-900">BODACIOUS.WEBSITE</strong> is a carefully curated collection of fun, goofy, and creative websites that spark joy and curiosity.
              </p>
              <p>
                This was whipped up by <a href="https://www.shaz.fun" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 font-medium">www.shaz.fun</a>, based on how much his wacky kids loved the first few Google Chrome Experiments he showed them. Better than the iPad screen.
              </p>
              <p>
                Send ideas to <a href="mailto:shaz@thesupply.com" className="text-orange-600 hover:text-orange-700 font-medium">shaz@thesupply.com</a>
              </p>
              <p className="text-sm text-gray-400 pt-4 border-t border-gray-200">
                This gallery is powered by a simple Google Sheet, making it easy to add new discoveries as we find them.
              </p>
            </div>
            <button
              onClick={() => setShowAbout(false)}
              className="mt-6 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-6 hover:shadow-lg transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
