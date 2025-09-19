// FIX: Defined all shared type interfaces for the application.
// This file was previously misconfigured with constant data instead of type definitions.

export interface User {
  name: string;
  school: string;
  ecoPoints: number;
  completedChallenges: string[]; // array of challenge IDs
  earnedBadges: string[]; // array of badge IDs
  avatarSeed: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export type ChallengeCategory = 'Waste' | 'Energy' | 'Water' | 'Biodiversity';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  ecoPoints: number;
  category: ChallengeCategory;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  school: string;
  ecoPoints: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface LearningTopic {
    id: string;
    title: string;
    description: string;
    icon: string;
}
