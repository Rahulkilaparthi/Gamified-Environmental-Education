import React, { useState } from 'react';
import { Challenge } from '../types';
import { useUser } from '../contexts/UserContext';
import { BadgeIcon } from './BadgeIcon';
import { Check, Plus } from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';

interface ChallengeCardProps {
  challenge: Challenge;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  const { user, completeChallenge } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isCompleted = user.completedChallenges.includes(challenge.id);

  const categoryIcons: {[key: string]: string} = {
    Waste: 'recycle',
    Energy: 'zap',
    Water: 'droplet',
    Biodiversity: 'bug',
  };

  const handleOpenModal = () => {
    if (!isCompleted) {
      setIsModalOpen(true);
    }
  };

  const handleConfirmComplete = () => {
    completeChallenge(challenge.id, challenge.ecoPoints);
    setIsModalOpen(false);
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmComplete}
        title="Confirm Completion"
        message="Are you sure you want to complete this challenge?"
      />
      <div className={`bg-surface dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col transition-all duration-300 ${isCompleted ? 'opacity-60' : 'hover:shadow-xl hover:-translate-y-1'}`}>
        <div className="p-5 flex-grow">
          <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold text-text-primary dark:text-gray-100">{challenge.title}</h3>
              <BadgeIcon iconName={categoryIcons[challenge.category]} className="w-8 h-8 text-secondary flex-shrink-0" />
          </div>
          <p className="text-text-secondary dark:text-gray-400 mt-2 text-sm">{challenge.description}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3 flex items-center justify-between">
          <div className="font-bold text-primary">
            {challenge.ecoPoints} Eco-Points
          </div>
          <button
            onClick={handleOpenModal}
            disabled={isCompleted}
            className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center space-x-1 transition-colors ${
              isCompleted
                ? 'bg-green-200 text-green-800 cursor-not-allowed'
                : 'bg-secondary text-white hover:bg-secondary-dark'
            }`}
          >
            {isCompleted ? <Check size={16}/> : <Plus size={16} />}
            <span>{isCompleted ? 'Completed' : 'Complete'}</span>
          </button>
        </div>
      </div>
    </>
  );
};