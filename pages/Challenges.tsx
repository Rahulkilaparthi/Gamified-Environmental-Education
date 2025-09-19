import React from 'react';
import { useUser } from '../contexts/UserContext';
import { ChallengeCard } from '../components/ChallengeCard';

const Challenges: React.FC = () => {
  const { challenges } = useUser();

  const categories = ['Waste', 'Energy', 'Water', 'Biodiversity'] as const;

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">Take on a Challenge</h1>
        <p className="text-lg text-text-secondary dark:text-gray-400 mt-2">Earn points and make a real-world impact!</p>
      </div>

      <div className="space-y-12">
        {categories.map(category => {
          const categoryChallenges = challenges.filter(c => c.category === category);
          if (categoryChallenges.length === 0) return null;

          return (
            <section key={category}>
              <h2 className="text-3xl font-bold border-b-4 border-primary inline-block mb-6">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryChallenges.map(challenge => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default Challenges;