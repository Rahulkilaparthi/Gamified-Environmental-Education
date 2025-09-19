import React from 'react';
import { useUser } from '../contexts/UserContext';
import { ChallengeCard } from '../components/ChallengeCard';
import { BadgeIcon } from '../components/BadgeIcon';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Star, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { LEADERBOARD_DATA } from '../constants';
import { LeaderboardEntry } from '../types';

const Dashboard: React.FC = () => {
  const { user, badges, challenges } = useUser();

  const userBadges = badges.filter(b => user.earnedBadges.includes(b.id));
  const activeChallenges = challenges.filter(c => !user.completedChallenges.includes(c.id)).slice(0, 3);
  
  // Create a dynamic leaderboard for the chart. This ensures the current user is
  // always represented and highlighted correctly.
  const currentUserEntry: LeaderboardEntry = {
    rank: 0, // Placeholder, will be recalculated
    name: user.name,
    school: user.school,
    ecoPoints: user.ecoPoints,
  };

  const combinedLeaderboard = [
    ...LEADERBOARD_DATA.filter(u => u.name.toLowerCase() !== user.name.toLowerCase()),
    currentUserEntry,
  ];

  const sortedLeaderboard = combinedLeaderboard
    .sort((a, b) => b.ecoPoints - a.ecoPoints)
    .map((u, index) => ({...u, rank: index + 1}));
  
  let chartData = sortedLeaderboard.slice(0, 5);
  
  const userRankIndex = sortedLeaderboard.findIndex(u => u.name === user.name);
  
  // If the user is not in the top 5, replace the last entry with the user's
  // data to ensure they are visible on the chart.
  if (userRankIndex >= 5) {
      chartData[4] = sortedLeaderboard[userRankIndex];
      // Re-sort in case the user's score is not the lowest in the chart
      chartData = chartData.sort((a, b) => b.ecoPoints - a.ecoPoints);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold">Welcome back, {user.name}!</h1>
        <p className="mt-2 text-lg opacity-90">Ready to make a difference today?</p>
        <div className="mt-6 bg-white/20 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Star className="w-8 h-8 text-yellow-300" />
            <span className="text-2xl font-bold">{user.ecoPoints}</span>
            <span className="text-lg">Eco-Points</span>
          </div>
          <NavLink to="/profile" className="bg-white text-green-600 font-semibold px-4 py-2 rounded-lg hover:bg-green-50 transition">
            My Profile
          </NavLink>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100">Your Next Challenges</h2>
              <NavLink to="/challenges" className="flex items-center space-x-1 text-primary hover:underline">
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </NavLink>
            </div>
            {activeChallenges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeChallenges.map(challenge => (
                        <ChallengeCard key={challenge.id} challenge={challenge} />
                    ))}
                </div>
            ) : (
                <div className="text-center bg-surface dark:bg-gray-800 p-8 rounded-lg">
                    <CheckCircle className="w-16 h-16 mx-auto text-green-500"/>
                    <h3 className="text-xl font-semibold mt-4">All Challenges Completed!</h3>
                    <p className="text-text-secondary dark:text-gray-400 mt-2">You're an Eco-Champion! New challenges coming soon.</p>
                </div>
            )}
          </section>

          <section>
             <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100 mb-4">Your Badges</h2>
              <div className="bg-surface dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                {userBadges.length > 0 ? (
                    <div className="flex flex-wrap gap-4">
                    {userBadges.map(badge => (
                        <div key={badge.id} className="text-center" title={badge.description}>
                            <BadgeIcon iconName={badge.icon} className="w-16 h-16" />
                            <p className="text-sm font-medium mt-1">{badge.name}</p>
                        </div>
                    ))}
                    </div>
                ) : (
                    <p className="text-text-secondary dark:text-gray-400">Complete challenges to earn new badges!</p>
                )}
            </div>
          </section>
        </div>
        
        <aside className="lg:col-span-1">
          <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100 mb-4">Leaderboard Snapshot</h2>
          <div className="bg-surface dark:bg-gray-800 p-4 rounded-xl shadow-sm h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tickLine={false} 
                  axisLine={false} 
                  width={110}
                  tick={{ fill: 'currentColor', fontSize: 12 }} 
                  className="text-text-secondary dark:text-gray-400"
                  interval={0}
                />
                <Tooltip 
                  cursor={{fill: 'rgba(107, 114, 128, 0.3)'}} 
                  contentStyle={{
                    backgroundColor: 'white', 
                    borderRadius: '0.5rem', 
                    borderColor: '#e5e7eb',
                    color: '#1f2937'
                  }}
                  formatter={(value: number) => [`${value} pts`, null]}
                  labelFormatter={(label) => <span className="font-bold">{label}</span>}
                />
                <Bar dataKey="ecoPoints" barSize={20}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === user.name ? '#f97316' : '#22c55e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Dashboard;