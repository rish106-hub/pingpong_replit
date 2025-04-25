import { create } from 'zustand';
import { DEFAULT_SETTINGS } from '../constants';
import { GameSettings, DifficultyLevel } from '../types';
import { getLocalStorage, setLocalStorage } from '../utils';

interface SettingsState extends GameSettings {
  // Actions
  toggleSound: () => void;
  toggleMusic: () => void;
  setPaddleSensitivity: (value: number) => void;
  setBallSpeed: (value: number) => void;
  setAiDifficulty: (level: DifficultyLevel) => void;
  toggleFps: () => void;
  resetToDefaults: () => void;
}

// Load settings from localStorage or use defaults
const loadSettings = (): GameSettings => {
  const savedSettings = getLocalStorage('pongSettings');
  return savedSettings ? { ...DEFAULT_SETTINGS, ...savedSettings } : DEFAULT_SETTINGS;
};

export const useSettings = create<SettingsState>((set) => {
  const initialSettings = loadSettings();
  
  return {
    ...initialSettings,
    
    toggleSound: () => set(state => {
      const newState = { soundEnabled: !state.soundEnabled };
      setLocalStorage('pongSettings', { ...getLocalStorage('pongSettings'), ...newState });
      return newState;
    }),
    
    toggleMusic: () => set(state => {
      const newState = { musicEnabled: !state.musicEnabled };
      setLocalStorage('pongSettings', { ...getLocalStorage('pongSettings'), ...newState });
      return newState;
    }),
    
    setPaddleSensitivity: (value) => set(() => {
      const newState = { paddleSensitivity: value };
      setLocalStorage('pongSettings', { ...getLocalStorage('pongSettings'), ...newState });
      return newState;
    }),
    
    setBallSpeed: (value) => set(() => {
      const newState = { ballSpeed: value };
      setLocalStorage('pongSettings', { ...getLocalStorage('pongSettings'), ...newState });
      return newState;
    }),
    
    setAiDifficulty: (level) => set(() => {
      const newState = { aiDifficulty: level };
      setLocalStorage('pongSettings', { ...getLocalStorage('pongSettings'), ...newState });
      return newState;
    }),
    
    toggleFps: () => set(state => {
      const newState = { showFps: !state.showFps };
      setLocalStorage('pongSettings', { ...getLocalStorage('pongSettings'), ...newState });
      return newState;
    }),
    
    resetToDefaults: () => set(() => {
      setLocalStorage('pongSettings', DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    })
  };
});
