import React from 'react';
import { useUser } from '../contexts/UserContext';
import { LEADERBOARD_DATA } from '../constants';
import { Crown, Medal, Award } from 'lucide-react';

const LeaderboardPage: React.FC = () => {
    const { user } = useUser();
    const sortedData = [...LEADERBOARD_DATA].sort((a, b) => b.ecoPoints - a.ecoPoints);
    const topThree = sortedData.slice(0, 3);
    const rest = sortedData.slice(3);

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Crown className="w-8 h-8 text-yellow-500" />;
        if (rank === 2) return <Medal className="w-8 h-8 text-gray-400" />;
        if (rank === 3) return <Award className="w-8 h-8 text-yellow-700" />;
        return <span className="font-bold text-lg w-8 text-center">{rank}</span>;
    };

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold">Top EcoChamps</h1>
                <p className="text-lg text-text-secondary dark:text-gray-400 mt-2">See who's leading the charge for a greener planet!</p>
            </div>
            
            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {topThree[1] && <PodiumCard user={topThree[1]} rank={2} delay="delay-150" />}
                {topThree[0] && <PodiumCard user={topThree[0]} rank={1} isFirst={true} delay="delay-0" />}
                {topThree[2] && <PodiumCard user={topThree[2]} rank={3} delay="delay-300" />}
            </div>

            {/* Rest of the list */}
            <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {rest.map((entry, index) => {
                        const isCurrentUser = entry.name === user.name;
                        return (
                            <li key={entry.rank} className={`flex items-center p-4 transition-colors ${isCurrentUser ? 'bg-green-100 dark:bg-green-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                                <div className="flex items-center w-16">
                                    {getRankIcon(index + 4)}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-semibold ${isCurrentUser ? 'text-primary' : 'text-text-primary dark:text-gray-100'}`}>{entry.name}</p>
                                    <p className="text-sm text-text-secondary dark:text-gray-400">{entry.school}</p>
                                </div>
                                <div className="text-lg font-bold text-primary">{entry.ecoPoints} pts</div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

const PodiumCard: React.FC<{user: typeof LEADERBOARD_DATA[0], rank: number, isFirst?: boolean, delay?: string}> = ({user, rank, isFirst, delay = ''}) => (
    <div className={`relative bg-surface dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg transition-transform hover:-translate-y-2 ${isFirst ? 'md:-translate-y-6' : ''} ${delay} animate-fade-in`}>
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 rounded-full ${rank === 1 ? 'bg-yellow-400' : rank === 2 ? 'bg-gray-400' : 'bg-yellow-700'}`}>
            {rank === 1 ? <Crown className="w-8 h-8 text-white"/> : rank === 2 ? <Medal className="w-8 h-8 text-white"/> : <Award className="w-8 h-8 text-white"/>}
        </div>
        <img src={`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${encodeURIComponent(user.name)}`} alt={user.name} className="w-24 h-24 rounded-full mx-auto mt-8 mb-4 border-4 border-white dark:border-gray-700 shadow-md bg-gray-200"/>
        <h3 className="text-xl font-bold">{user.name}</h3>
        <p className="text-text-secondary dark:text-gray-400">{user.school}</p>
        <p className="text-2xl font-bold text-primary mt-2">{user.ecoPoints} pts</p>
    </div>
)

export default LeaderboardPage;