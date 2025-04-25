import { create } from 'zustand';
import { getLocalStorage, setLocalStorage } from '../utils';

interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  highestScore: number;
  longestRally: number;
  lastPlayed: string | null;
}

interface PlayerState extends PlayerStats {
  // Actions
  incrementGamesPlayed: () => void;
  incrementGamesWon: () => void;
  setHighestScore: (score: number) => void;
  updateLongestRally: (hits: number) => void;
  resetStats: () => void;
}

const initialStats: PlayerStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  highestScore: 0,
  longestRally: 0,
  lastPlayed: null
};

// Load player stats from localStorage or use defaults
const loadPlayerStats = (): PlayerStats => {
  const savedStats = getLocalStorage('pongPlayerStats');
  return savedStats ? { ...initialStats, ...savedStats } : initialStats;
};

export const usePlayer = create<PlayerState>((set, get) => {
  const stats = loadPlayerStats();
  
  return {
    ...stats,
    
    incrementGamesPlayed: () => set(state => {
      const newState = { 
        gamesPlayed: state.gamesPlayed + 1,
        lastPlayed: new Date().toISOString()
      };
      setLocalStorage('pongPlayerStats', { ...getLocalStorage('pongPlayerStats'), ...newState });
      return newState;
    }),
    
    incrementGamesWon: () => set(state => {
      const newState = { gamesWon: state.gamesWon + 1 };
      setLocalStorage('pongPlayerStats', { ...getLocalStorage('pongPlayerStats'), ...newState });
      return newState;
    }),
    
    setHighestScore: (score) => set(state => {
      if (score <= state.highestScore) return {};
      
      const newState = { highestScore: score };
      setLocalStorage('pongPlayerStats', { ...getLocalStorage('pongPlayerStats'), ...newState });
      return newState;
    }),
    
    updateLongestRally: (hits) => set(state => {
      if (hits <= state.longestRally) return {};
      
      const newState = { longestRally: hits };
      setLocalStorage('pongPlayerStats', { ...getLocalStorage('pongPlayerStats'), ...newState });
      return newState;
    }),
    
    resetStats: () => set(() => {
      setLocalStorage('pongPlayerStats', initialStats);
      return initialStats;
    })
  };
});
