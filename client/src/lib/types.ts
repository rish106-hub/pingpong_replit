// Game states
export type GamePhase = 'menu' | 'game' | 'pause' | 'gameOver';
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'pro';

// Game settings
export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  paddleSensitivity: number; // 0.5-2.0
  ballSpeed: number; // 0.5-2.0 multiplier
  aiDifficulty: DifficultyLevel;
  showFps: boolean;
}

// Game elements
export interface Vector2D {
  x: number;
  y: number;
}

export interface Ball {
  position: Vector2D;
  velocity: Vector2D;
  radius: number;
  spin: number; // -1.0 to 1.0, affects trajectory
}

export interface Paddle {
  position: Vector2D;
  width: number;
  height: number;
  speed: number;
}

export interface Score {
  player: number;
  ai: number;
}

// Game state
export interface GameState {
  phase: GamePhase;
  ball: Ball;
  playerPaddle: Paddle;
  aiPaddle: Paddle;
  score: Score;
  lastHitBy: 'player' | 'ai' | null;
  roundStartCountdown: number | null;
  winner: 'player' | 'ai' | null;
}
