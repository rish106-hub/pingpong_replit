import { useEffect, useRef } from 'react';
import { usePongGame } from '@/lib/stores/usePongGame';
import { useSettings } from '@/lib/stores/useSettings';
import { AI_DIFFICULTY_SETTINGS } from '@/lib/constants';

export function AIController() {
  const gameState = usePongGame();
  const { aiDifficulty } = useSettings();
  
  // References to track AI decision timing
  const lastUpdateTime = useRef<number>(0);
  const targetY = useRef<number | null>(null);
  
  // Get AI settings based on difficulty
  const aiSettings = AI_DIFFICULTY_SETTINGS[aiDifficulty];
  
  useEffect(() => {
    if (gameState.phase !== 'game' || gameState.roundStartCountdown !== null) {
      return;
    }
    
    const updateAI = () => {
      const now = Date.now();
      const currentGameState = usePongGame.getState();
      
      // Only update AI decision after the reaction time has passed
      if (now - lastUpdateTime.current >= aiSettings.reactionTime) {
        const ball = currentGameState.ball;
        const aiPaddle = currentGameState.aiPaddle;
        
        // Only try to intercept if the ball is moving toward the AI
        if (ball.velocity.x > 0) {
          // Calculate where the ball will intersect with the AI paddle's x position
          const distanceToTravel = aiPaddle.position.x - ball.position.x;
          const timeToIntercept = distanceToTravel / ball.velocity.x;
          
          // Predict the y-position at intercept
          const predictedY = ball.position.y + ball.velocity.y * timeToIntercept;
          
          // Apply AI accuracy - add some randomness to the prediction
          const errorAmount = (1 - aiSettings.accuracy) * aiSettings.errorMargin;
          const errorOffset = (Math.random() * 2 - 1) * errorAmount;
          
          // Set the target Y position
          targetY.current = predictedY + errorOffset;
        } else {
          // If ball is moving away, return to center with some variance
          targetY.current = currentGameState.aiPaddle.position.y * 0.9 + 
                            (currentGameState.ball.position.y * 0.1);
        }
        
        lastUpdateTime.current = now;
      }
      
      // Move AI paddle toward the target position
      if (targetY.current !== null) {
        const currentState = usePongGame.getState();
        const paddleY = currentState.aiPaddle.position.y;
        const distance = targetY.current - paddleY;
        
        // Limit movement speed based on AI difficulty
        const direction = distance > 0 ? 1 : -1;
        const speed = Math.min(Math.abs(distance), aiSettings.maxSpeed) * direction;
        
        if (Math.abs(distance) > 5) {
          currentState.movePaddle('ai', paddleY + speed);
        }
      }
      
      // Continue the loop if still in gameplay
      if (usePongGame.getState().phase === 'game') {
        requestAnimationFrame(updateAI);
      }
    };
    
    // Start the AI update loop
    const frameId = requestAnimationFrame(updateAI);
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [aiSettings]); // Only depend on aiSettings to avoid re-creating the effect
  
  return null; // This is a logic-only component
}
