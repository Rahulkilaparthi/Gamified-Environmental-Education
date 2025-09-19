import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, NavLink, Outlet, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Challenges from './pages/Challenges';
import LeaderboardPage from './pages/LeaderboardPage';
import Profile from './pages/Profile';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { Leaf, Award, CheckCircle, BarChart, User as UserIcon, Sun, Moon } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: Leaf },
  { path: '/challenges', label: 'Challenges', icon: CheckCircle },
  { path: '/learn', label: 'Learn', icon: Award },
  { path: '/leaderboard', label: 'Leaderboard', icon: BarChart },
  { path: '/profile', label: 'Profile', icon: UserIcon },
];

const App: React.FC = () => {
  return (
    <UserProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route 
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </HashRouter>
    </UserProvider>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};


const MainLayout: React.FC = () => (
  <div className="min-h-screen flex flex-col font-sans">
    <Header />
    <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
       <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
    </main>
    <Footer />
  </div>
);


const Header: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="bg-surface dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <NavLink to="/" className="flex items-center space-x-2">
          <Leaf className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-primary">EcoChamps</span>
        </NavLink>
        <div className="flex items-center">
            <ul className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 text-lg font-medium transition-colors duration-200 ${
                        isActive ? 'text-primary' : 'text-text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-primary'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="ml-6 p-2 rounded-full text-text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800 transition-colors duration-200"
            >
              {isDarkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-gray-600" />}
            </button>
        </div>
        <div className="md:hidden">
            {/* Mobile menu could be implemented here */}
        </div>
      </nav>
    </header>
  );
};

const Footer: React.FC = () => (
    <footer className="bg-gray-800 dark:bg-black/20 text-white mt-auto transition-colors duration-300">
        <div className="container mx-auto p-6 text-center">
            <p>&copy; {new Date().getFullYear()} EcoChamps. All rights reserved.</p>
            <p className="text-sm text-gray-400 mt-1">Fostering a greener tomorrow, one challenge at a time.</p>
        </div>
    </footer>
);

export default App;