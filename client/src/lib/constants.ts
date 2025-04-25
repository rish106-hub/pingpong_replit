import { DifficultyLevel, GameSettings } from './types';

// Canvas & rendering
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const COURT_WIDTH = 700;
export const COURT_HEIGHT = 500;

// Game elements
export const BALL_RADIUS = 7.5;
export const BALL_INITIAL_SPEED = 8;
export const BALL_MAX_SPEED = 20;
export const BALL_SPEED_INCREMENT = 0.2;

export const PADDLE_WIDTH = 15;
export const PADDLE_HEIGHT = 100;
export const PADDLE_MARGIN = 40; // Distance from edge
export const PLAYER_PADDLE_SPEED = 12;

// AI difficulty settings
export const AI_DIFFICULTY_SETTINGS: Record<DifficultyLevel, {
  reactionTime: number; // milliseconds
  maxSpeed: number;
  accuracy: number; // 0-1, percentage of perfect prediction
  errorMargin: number; // pixels
}> = {
  easy: { 
    reactionTime: 300,
    maxSpeed: 6,
    accuracy: 0.5,
    errorMargin: 40
  },
  medium: { 
    reactionTime: 200,
    maxSpeed: 8,
    accuracy: 0.7,
    errorMargin: 25
  },
  hard: { 
    reactionTime: 100,
    maxSpeed: 10,
    accuracy: 0.85,
    errorMargin: 15
  },
  pro: { 
    reactionTime: 50,
    maxSpeed: 12,
    accuracy: 0.95,
    errorMargin: 5
  }
};

// Game rules
export const POINTS_TO_WIN = 11;
export const MUST_WIN_BY = 2;
export const ROUND_START_COUNTDOWN = 3; // seconds
export const ROUND_PAUSE_DURATION = 1500; // milliseconds

// Sound files
export const SOUNDS = {
  PADDLE_HIT: '/sounds/hit.mp3',
  WALL_HIT: '/sounds/hit.mp3',
  SCORE: '/sounds/success.mp3',
  BACKGROUND: '/sounds/background.mp3'
};

// Default settings
export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  paddleSensitivity: 1.0,
  ballSpeed: 1.0,
  aiDifficulty: 'medium',
  showFps: false
};

// Colors
export const COLORS = {
  BACKGROUND: '#1a1a2e',
  COURT: '#16213e',
  NET: '#ffffff',
  PADDLE: '#ffffff',
  BALL: '#e94560',
  TEXT: '#ffffff',
  UI_BACKGROUND: 'rgba(0, 0, 0, 0.7)',
  UI_ACCENT: '#e94560'
};
