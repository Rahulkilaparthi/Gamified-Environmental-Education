import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Badge, Challenge } from '../types';
import { BADGES, CHALLENGES } from '../constants';

// The full user object stored in our "DB", including auth info
// FIX: Corrected typo in password property definition
type StoredUser = User & { email: string; password: string; };

// Helper to get the entire user database from local storage
const getUserDb = (): Record<string, StoredUser> => {
    try {
        const db = localStorage.getItem('ecoChampsUserDb');
        return db ? JSON.parse(db) : {};
    } catch {
        return {};
    }
};

// Helper to save the entire user database to local storage
const saveUserDb = (db: Record<string, StoredUser>) => {
    localStorage.setItem('ecoChampsUserDb', JSON.stringify(db));
};

interface UserContextType {
  user: User | null;
  badges: Badge[];
  challenges: Challenge[];
  login: (email: string, pass: string) => void;
  signup: (name: string, school: string, email: string, pass: string) => void;
  logout: () => void;
  completeChallenge: (challengeId: string, points: number) => void;
  addPoints: (points: number) => void;
  updateAvatarSeed: (seed: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<StoredUser | null>(() => {
    try {
      const currentUserEmail = localStorage.getItem('ecoChampsCurrentUserEmail');
      if (currentUserEmail) {
        const db = getUserDb();
        return db[currentUserEmail] || null;
      }
      return null;
    } catch (error) {
      console.error("Failed to initialize user from localStorage", error);
      return null;
    }
  });

  // This effect runs whenever the user object in state changes,
  // persisting any updates (like new points) back to our main DB in localStorage.
  useEffect(() => {
    if (user) {
      const db = getUserDb();
      db[user.email] = user;
      saveUserDb(db);
    }
  }, [user]);

  const login = (email: string, pass: string) => {
    const db = getUserDb();
    const userData = db[email];

    if (!userData || userData.password !== pass) {
        throw new Error("Invalid email or password.");
    }
    
    localStorage.setItem('ecoChampsCurrentUserEmail', email);
    setUser(userData);
  };

  const signup = (name: string, school: string, email: string, pass: string) => {
    const db = getUserDb();
    if (db[email]) {
        throw new Error("An account with this email already exists.");
    }
    
    const newUser: StoredUser = {
      name,
      school,
      email,
      password: pass,
      ecoPoints: 0,
      completedChallenges: [],
      earnedBadges: [],
      avatarSeed: name, // Initialize avatar seed with name
    };

    const newDb = { ...db, [email]: newUser };
    saveUserDb(newDb);
    
    localStorage.setItem('ecoChampsCurrentUserEmail', email);
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecoChampsCurrentUserEmail');
  };
  
  const updateAvatarSeed = (seed: string) => {
    setUser(prevUser => {
        if (!prevUser) return null;
        return { ...prevUser, avatarSeed: seed };
    });
  };

  const completeChallenge = (challengeId: string, points: number) => {
    setUser((prevUser) => {
      if (!prevUser || prevUser.completedChallenges.includes(challengeId)) return prevUser;

      const newPoints = prevUser.ecoPoints + points;
      const newCompletedChallenges = [...prevUser.completedChallenges, challengeId];
      
      const newBadges = BADGES.filter(badge => 
        !prevUser.earnedBadges.includes(badge.id) &&
        ((badge.id === 'b2' && newCompletedChallenges.length >= 3) ||
        (badge.id === 'b3' && newPoints >= 500))
      ).map(b => b.id);

      return {
        ...prevUser,
        ecoPoints: newPoints,
        completedChallenges: newCompletedChallenges,
        earnedBadges: [...prevUser.earnedBadges, ...newBadges],
      };
    });
  };

  const addPoints = (points: number) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      return {...prevUser, ecoPoints: prevUser.ecoPoints + points};
    });
  };

  return (
    <UserContext.Provider value={{ user, badges: BADGES, challenges: CHALLENGES, login, signup, logout, completeChallenge, addPoints, updateAvatarSeed }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};