import { Badge, Challenge, LeaderboardEntry } from './types';

export const BADGES: Badge[] = [
  { id: 'b1', name: 'Eco-Starter', description: 'Complete your first challenge!', icon: 'seedling' },
  { id: 'b2', name: 'Challenge Champion', description: 'Complete 3 challenges.', icon: 'trophy' },
  { id: 'b3', name: 'Point Prodigy', description: 'Earn 500 Eco-Points.', icon: 'star' },
  { id: 'b4', name: 'Waste Warrior', description: 'Complete a waste management challenge.', icon: 'recycle' },
];

export const CHALLENGES: Challenge[] = [
  { id: 'ch1', title: 'Waste Segregation Week', description: 'Properly segregate waste at home for a full week.', ecoPoints: 50, category: 'Waste' },
  { id: 'ch2', title: 'DIY Compost Bin', description: 'Create your own compost bin for kitchen scraps.', ecoPoints: 75, category: 'Waste' },
  { id: 'ch3', title: 'Energy-Free Hour', description: 'Spend one hour without using any electricity.', ecoPoints: 30, category: 'Energy' },
  { id: 'ch4', title: 'Plant a Sapling', description: 'Plant a tree in your community or backyard.', ecoPoints: 100, category: 'Biodiversity' },
  { id: 'ch5', title: 'Fix a Leak', description: 'Find and fix a leaking tap at home to save water.', ecoPoints: 40, category: 'Water' },
];

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
    { rank: 1, name: 'Priya Sharma', school: 'Greenwood International', ecoPoints: 1250 },
    { rank: 2, name: 'Rohan Kumar', school: 'Oakridge Academy', ecoPoints: 1100 },
    { rank: 3, name: 'Alex Green', school: 'Springfield High', ecoPoints: 125 }, // User's data for context
    { rank: 4, name: 'Anika Singh', school: 'Greenwood International', ecoPoints: 980 },
    { rank: 5, name: 'Vivaan Mehta', school: 'Riverdale Public School', ecoPoints: 950 },
];

export const LEARNING_TOPICS = [
    { id: 'waste', title: 'Waste Management', description: 'Learn how to reduce, reuse, and recycle.', icon: 'recycle' },
    { id: 'water', title: 'Water Conservation', description: 'Discover ways to save our most precious resource.', icon: 'droplet' },
    { id: 'energy', title: 'Renewable Energy', description: 'Explore the future of power with solar, wind, and more.', icon: 'sun' },
    { id: 'biodiversity', title: 'Protecting Biodiversity', description: 'Understand the importance of the variety of life on Earth.', icon: 'bug' },
    { id: 'climate', title: 'Climate Change', description: 'Causes, effects, and how we can take action.', icon: 'globe' },
    { id: 'fashion', title: 'Sustainable Fashion', description: 'The environmental cost of the fashion industry.', icon: 'shirt' },
    { id: 'agriculture', title: 'Sustainable Agriculture', description: 'Learn about eco-friendly farming practices.', icon: 'carrot' },
    { id: 'oceans', title: 'Ocean Conservation', description: 'Discover how to protect our marine ecosystems.', icon: 'waves' },
];