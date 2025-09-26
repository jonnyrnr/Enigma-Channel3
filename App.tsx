import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ServicesPage from './components/ServicesPage';
import ToolkitPage from './components/ToolkitPage';
import AuthModal from './components/AuthModal';
import { MoonIcon, WandSparklesIcon, LogInIcon, LogOutIcon } from './components/Icons';
import type { User } from './types';

type ActiveView = 'services' | 'toolkit';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('services');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  useEffect(() => {
    // Check for a logged-in user in session storage
    const loggedInUser = sessionStorage.getItem('enigmaUser');
    if (loggedInUser) {
      setCurrentUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('enigmaUser');
    // If on toolkit page when logging out, switch back to services
    if (activeView === 'toolkit') {
      setActiveView('services');
    }
  };
  
  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    sessionStorage.setItem('enigmaUser', JSON.stringify(user));
    setShowAuthModal(false);
  }

  const NavButton: React.FC<{
    view: ActiveView;
    label: string;
    icon: React.ReactNode;
  }> = ({ view, label, icon }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex items-center justify-center w-full md:w-auto px-6 py-3 font-fancy text-lg font-bold rounded-lg md:rounded-b-none md:rounded-t-lg transition-all duration-300 ease-in-out border-b-4
        ${activeView === view
          ? 'text-white border-pink-500 bg-gray-800/50'
          : 'text-gray-400 border-transparent hover:text-white hover:bg-gray-800/20'
        }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-transparent text-gray-200">
      <div className="container mx-auto p-4 sm:p-6 md:p-8 relative">
        <header className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 font-fancy">
              The Enigma Channel
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                <span className="text-purple-300 hidden sm:block">Welcome, {currentUser.email.split('@')[0]}</span>
                <button
                  onClick={handleLogout}
                  className="font-fancy font-bold bg-gray-800/50 text-purple-300 py-2 px-4 rounded-full shadow-lg hover:shadow-xl hover:bg-purple-900/50 transform transition-all duration-300 ease-in-out flex items-center flex-shrink-0"
                >
                  <LogOutIcon className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                 <button
                  onClick={() => setShowAuthModal(true)}
                  className="font-fancy font-bold bg-gray-800/50 text-purple-300 py-2 px-4 rounded-full shadow-lg hover:shadow-xl hover:bg-purple-900/50 transform transition-all duration-300 ease-in-out flex items-center flex-shrink-0"
                >
                  <LogInIcon className="w-5 h-5 mr-2" />
                  Login / Sign Up
                </button>
              </>
            )}
          </div>
        </header>

        <nav className="flex flex-col md:flex-row justify-center items-center mb-8 md:border-b-2 border-purple-500/20 gap-2 md:gap-0">
            <NavButton view="services" label="About & Services" icon={<MoonIcon className="w-5 h-5 mr-3" />} />
            {currentUser?.role === 'admin' && (
              <NavButton view="toolkit" label="Creator Toolkit" icon={<WandSparklesIcon className="w-5 h-5 mr-3" />} />
            )}
        </nav>

        <main className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {activeView === 'services' && <ServicesPage key="services" />}
            {activeView === 'toolkit' && currentUser?.role === 'admin' && <ToolkitPage key="toolkit" />}
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={handleAuthSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;