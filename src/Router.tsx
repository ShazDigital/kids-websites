import { useEffect, useState } from 'react';
import App from './App';
import Admin from './Admin';

export default function Router() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleNavigation = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleNavigation);

    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args);
      handleNavigation();
    };

    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  if (currentPath === '/admin') {
    return <Admin />;
  }

  return <App />;
}
