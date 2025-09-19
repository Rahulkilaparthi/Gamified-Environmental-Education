import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { BadgeIcon } from '../components/BadgeIcon';
import { Star, CheckCircle, BarChart2, LogOut, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AvatarModal } from '../components/AvatarModal';

const Profile: React.FC = () => {
  const { user, badges, logout } = useUser();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) {
    // This should ideally not be reached due to ProtectedRoute, but it's good practice
    return <div>Loading profile...</div>;
  }

  const earnedBadges = badges.filter(b => user.earnedBadges.includes(b.id));

  const stats = [
    { label: 'Total Points', value: user.ecoPoints, icon: Star, color: 'text-yellow-500' },
    { label: 'Challenges Done', value: user.completedChallenges.length, icon: CheckCircle, color: 'text-green-500' },
    { label: 'Badges Earned', value: earnedBadges.length, icon: BarChart2, color: 'text-blue-500' },
  ];
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="animate-fade-in">
      {isModalOpen && <AvatarModal currentSeed={user.avatarSeed} onClose={() => setIsModalOpen(false)} />}

      <section className="bg-surface dark:bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-y-6 md:space-y-0 md:space-x-8 flex-grow">
            <div className="relative group">
                <img 
                  src={`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${encodeURIComponent(user.avatarSeed)}`}
                  alt={user.name} 
                  className="w-36 h-36 rounded-full border-4 border-primary shadow-md bg-gray-200"
                />
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Change avatar"
                >
                    <ImageIcon className="w-8 h-8" />
                </button>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-text-primary dark:text-gray-100">{user.name}</h1>
              <p className="text-xl text-text-secondary dark:text-gray-400 mt-1">{user.school}</p>
            </div>
        </div>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 mt-6 md:mt-0"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map(stat => (
            <div key={stat.label} className="bg-surface dark:bg-gray-800 p-6 rounded-xl shadow-sm flex items-center space-x-4">
              <stat.icon className={`w-12 h-12 ${stat.color}`} />
              <div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-text-secondary dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Badge Collection</h2>
        <div className="bg-surface dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          {earnedBadges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {earnedBadges.map(badge => (
                <div key={badge.id} className="flex flex-col items-center text-center p-4 bg-background dark:bg-gray-700 rounded-lg hover:shadow-md transition">
                  <BadgeIcon iconName={badge.icon} className="w-20 h-20 mb-2" />
                  <h3 className="font-semibold">{badge.name}</h3>
                  <p className="text-xs text-text-secondary dark:text-gray-400 mt-1">{badge.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-text-secondary dark:text-gray-400 py-8">No badges earned yet. Complete some challenges to start your collection!</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;