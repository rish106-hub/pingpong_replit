import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Ball, GamePhase, GameState, Paddle, Score, Vector2D } from '../types';
import { 
  BALL_INITIAL_SPEED, 
  BALL_RADIUS, 
  COURT_HEIGHT, 
  COURT_WIDTH, 
  PADDLE_HEIGHT, 
  PADDLE_MARGIN, 
  PADDLE_WIDTH, 
  PLAYER_PADDLE_SPEED,
  POINTS_TO_WIN, 
  MUST_WIN_BY,
  ROUND_START_COUNTDOWN
} from '../constants';
import { useAudio } from './useAudio';

// Initialize game state
const initialBall: Ball = {
  position: { x: COURT_WIDTH / 2, y: COURT_HEIGHT / 2 },
  velocity: { x: 0, y: 0 }, // Set in initialize round
  radius: BALL_RADIUS,
  spin: 0
};

const initialPlayerPaddle: Paddle = {
  position: { x: PADDLE_MARGIN, y: COURT_HEIGHT / 2 },
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  speed: PLAYER_PADDLE_SPEED
};

const initialAiPaddle: Paddle = {
  position: { x: COURT_WIDTH - PADDLE_MARGIN, y: COURT_HEIGHT / 2 },
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  speed: PLAYER_PADDLE_SPEED // Will be adjusted by difficulty
};

const initialScore: Score = {
  player: 0,
  ai: 0
};

const initialGameState: GameState = {
  phase: 'menu',
  ball: initialBall,
  playerPaddle: initialPlayerPaddle,
  aiPaddle: initialAiPaddle,
  score: initialScore,
  lastHitBy: null,
  roundStartCountdown: null,
  winner: null
};

// Helper functions
const resetBall = (): Ball => ({
  ...initialBall,
  position: { x: COURT_WIDTH / 2, y: COURT_HEIGHT / 2 }
});

const getRandomDirection = (): Vector2D => {
  const angle = (Math.random() * Math.PI / 4) - Math.PI / 8;
  const direction = Math.random() > 0.5 ? 1 : -1; // Left or right
  
  return {
    x: Math.cos(angle) * direction,
    y: Math.sin(angle)
  };
};

const normalizeVector = (v: Vector2D, magnitude: number): Vector2D => {
  const length = Math.sqrt(v.x * v.x + v.y * v.y);
  return {
    x: (v.x / length) * magnitude,
    y: (v.y / length) * magnitude
  };
};

interface PongGameState extends GameState {
  // Game flow actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  returnToMenu: () => void;
  
  // Gameplay actions
  initializeRound: () => void;
  scorePoint: (scoredBy: 'player' | 'ai') => void;
  movePaddle: (paddleType: 'player' | 'ai', y: number) => void;
  update: (delta: number) => void;
}

export const usePongGame = create<PongGameState>()(
  subscribeWithSelector((set, get) => ({
    ...initialGameState,
    
    startGame: () => set(() => ({
      phase: 'game',
      score: initialScore,
      winner: null,
      roundStartCountdown: ROUND_START_COUNTDOWN,
    })),
    
    pauseGame: () => set(state => state.phase === 'game' ? { phase: 'pause' } : {}),
    
    resumeGame: () => set(state => state.phase === 'pause' ? { phase: 'game' } : {}),
    
    resetGame: () => set(() => ({
      ...initialGameState,
      phase: 'game',
      roundStartCountdown: ROUND_START_COUNTDOWN,
    })),
    
    returnToMenu: () => set(() => ({
      ...initialGameState
    })),
    
    initializeRound: () => {
      // Set a random initial direction and velocity
      const direction = getRandomDirection();
      const initialVelocity = normalizeVector(direction, BALL_INITIAL_SPEED);
      
      set(state => ({
        ...state,
        ball: {
          ...resetBall(),
          velocity: initialVelocity
        },
        roundStartCountdown: null
      }));
    },
    
    scorePoint: (scoredBy) => {
      const { playSuccess } = useAudio.getState();
      playSuccess();
      
      set(state => {
        // Update score
        const newScore = { ...state.score };
        if (scoredBy === 'player') {
          newScore.player += 1;
        } else {
          newScore.ai += 1;
        }
        
        // Check for win condition
        let winner: 'player' | 'ai' | null = null;
        if (
          (newScore.player >= POINTS_TO_WIN && newScore.player - newScore.ai >= MUST_WIN_BY) ||
          (newScore.ai >= POINTS_TO_WIN && newScore.ai - newScore.player >= MUST_WIN_BY)
        ) {
          winner = newScore.player > newScore.ai ? 'player' : 'ai';
        }
        
        // Return the new state
        return {
          score: newScore,
          ball: resetBall(),
          winner,
          phase: winner ? 'gameOver' : 'game',
          roundStartCountdown: winner ? null : ROUND_START_COUNTDOWN,
        };
      });
    },
    
    movePaddle: (paddleType, y) => {
      set(state => {
        // Clamp y position to keep paddle within court
        const halfPaddleHeight = PADDLE_HEIGHT / 2;
        const clampedY = Math.max(halfPaddleHeight, Math.min(COURT_HEIGHT - halfPaddleHeight, y));
        
        if (paddleType === 'player') {
          return {
            playerPaddle: {
              ...state.playerPaddle,
              position: { ...state.playerPaddle.position, y: clampedY }
            }
          };
        } else {
          return {
            aiPaddle: {
              ...state.aiPaddle,
              position: { ...state.aiPaddle.position, y: clampedY }
            }
          };
        }
      });
    },
    
    update: (delta) => {
      // Skip updates for menu, pause, or game over
      const { phase, roundStartCountdown } = get();
      if (phase !== 'game' || roundStartCountdown !== null) return;
      
      set(state => {
        const { ball, playerPaddle, aiPaddle } = state;
        const { playHit } = useAudio.getState();
        
        // Calculate new ball position based on velocity
        const newBallPos = {
          x: ball.position.x + ball.velocity.x,
          y: ball.position.y + ball.velocity.y
        };
        
        let newVelocity = { ...ball.velocity };
        let lastHitBy = state.lastHitBy;
        
        // Check for collisions with top and bottom walls
        if (newBallPos.y - ball.radius < 0 || newBallPos.y + ball.radius > COURT_HEIGHT) {
          newVelocity.y = -newVelocity.y;
          newBallPos.y = newBallPos.y < COURT_HEIGHT / 2 ? ball.radius : COURT_HEIGHT - ball.radius;
          playHit();
        }
        
        // Check for collision with player paddle
        if (
          newBallPos.x - ball.radius < playerPaddle.position.x + playerPaddle.width / 2 &&
          newBallPos.x - ball.radius > playerPaddle.position.x - playerPaddle.width / 2 &&
          newBallPos.y > playerPaddle.position.y - playerPaddle.height / 2 &&
          newBallPos.y < playerPaddle.position.y + playerPaddle.height / 2
        ) {
          // Calculate normalized hit position (-1 to 1) relative to paddle center
          const hitPos = (newBallPos.y - playerPaddle.position.y) / (playerPaddle.height / 2);
          
          // Reflect x velocity and adjust y based on hit position
          newVelocity.x = -newVelocity.x;
          // Adjust y velocity based on where the ball hit the paddle
          newVelocity.y += hitPos * 5; // Add some y velocity based on hit position
          
          // Normalize to maintain consistent speed
          newVelocity = normalizeVector(newVelocity, Math.sqrt(ball.velocity.x * ball.velocity.x + ball.velocity.y * ball.velocity.y));
          
          // Ensure ball is not stuck in paddle
          newBallPos.x = playerPaddle.position.x + playerPaddle.width / 2 + ball.radius;
          
          lastHitBy = 'player';
          playHit();
        }
        
        // Check for collision with AI paddle
        if (
          newBallPos.x + ball.radius > aiPaddle.position.x - aiPaddle.width / 2 &&
          newBallPos.x + ball.radius < aiPaddle.position.x + aiPaddle.width / 2 &&
          newBallPos.y > aiPaddle.position.y - aiPaddle.height / 2 &&
          newBallPos.y < aiPaddle.position.y + aiPaddle.height / 2
        ) {
          // Calculate normalized hit position (-1 to 1) relative to paddle center
          const hitPos = (newBallPos.y - aiPaddle.position.y) / (aiPaddle.height / 2);
          
          // Reflect x velocity and adjust y based on hit position
          newVelocity.x = -newVelocity.x;
          // Adjust y velocity based on where the ball hit the paddle
          newVelocity.y += hitPos * 5; // Add some y velocity based on hit position
          
          // Normalize to maintain consistent speed
          newVelocity = normalizeVector(newVelocity, Math.sqrt(ball.velocity.x * ball.velocity.x + ball.velocity.y * ball.velocity.y));
          
          // Ensure ball is not stuck in paddle
          newBallPos.x = aiPaddle.position.x - aiPaddle.width / 2 - ball.radius;
          
          lastHitBy = 'ai';
          playHit();
        }
        
        // Check for scoring (ball out of bounds on x-axis)
        if (newBallPos.x - ball.radius > COURT_WIDTH) {
          // Player scores
          return state; // Will be handled by scorePoint after this update
        } else if (newBallPos.x + ball.radius < 0) {
          // AI scores
          return state; // Will be handled by scorePoint after this update
        }
        
        // Update ball position
        const newBall = {
          ...ball,
          position: newBallPos,
          velocity: newVelocity
        };
        
        return {
          ball: newBall,
          lastHitBy
        };
      });
      
      // Check for scoring conditions (separate to avoid state update conflicts)
      const { ball } = get();
      if (ball.position.x - ball.radius > COURT_WIDTH) {
        get().scorePoint('player');
      } else if (ball.position.x + ball.radius < 0) {
        get().scorePoint('ai');
      }
    }
  }))
);
