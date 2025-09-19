import React, { useState, useMemo } from 'react';
import { useUser } from '../contexts/UserContext';
import { Check, X as XIcon } from 'lucide-react';

interface AvatarModalProps {
  currentSeed: string;
  onClose: () => void;
}

const generateRandomSeed = () => Math.random().toString(36).substring(2, 10);

export const AvatarModal: React.FC<AvatarModalProps> = ({ currentSeed, onClose }) => {
  const { updateAvatarSeed } = useUser();
  const [selectedSeed, setSelectedSeed] = useState<string>(currentSeed);

  const randomSeeds = useMemo(() => {
    return Array.from({ length: 5 }, generateRandomSeed);
  }, []);

  const handleSave = () => {
    updateAvatarSeed(selectedSeed);
    onClose();
  };
  
  const allSeeds = [currentSeed, ...randomSeeds];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      aria-labelledby="avatar-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-surface dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg p-6 m-4 animate-fade-in-up">
        <div className="flex justify-between items-center mb-4">
          <h2 id="avatar-modal-title" className="text-2xl font-bold">Choose Your Avatar</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
            aria-label="Close modal"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <p className="text-text-secondary dark:text-gray-400 mb-6">Select a new avatar to represent you in the EcoChamps community!</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {allSeeds.map(seed => (
            <button
              key={seed}
              onClick={() => setSelectedSeed(seed)}
              className={`relative rounded-full aspect-square border-4 transition-all ${
                selectedSeed === seed ? 'border-primary scale-105' : 'border-transparent hover:border-primary/50'
              }`}
            >
              <img
                src={`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${encodeURIComponent(seed)}`}
                alt={`Avatar for seed ${seed}`}
                className="w-full h-full rounded-full bg-gray-200"
              />
              {selectedSeed === seed && (
                <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={selectedSeed === currentSeed}
            className="px-6 py-2 rounded-lg font-semibold text-white bg-primary hover:bg-primary-dark transition disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};