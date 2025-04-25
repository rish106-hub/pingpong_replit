import { useEffect, useRef } from 'react';
import { usePongGame } from '@/lib/stores/usePongGame';
import { useSettings } from '@/lib/stores/useSettings';
import { ROUND_START_COUNTDOWN } from '@/lib/constants';

export function useGamePhysics() {
  const gameState = usePongGame();
  const { ballSpeed } = useSettings();
  const lastTime = useRef<number>(0);
  const countdown = useRef<number | null>(null);
  
  // Game loop
  useEffect(() => {
    if (gameState.phase !== 'game') return;
    
    const updateGame = (time: number) => {
      if (!lastTime.current) {
        lastTime.current = time;
        requestAnimationFrame(updateGame);
        return;
      }
      
      const delta = time - lastTime.current;
      lastTime.current = time;
      
      // Handle countdown timer
      if (gameState.roundStartCountdown !== null) {
        if (countdown.current === null) {
          countdown.current = gameState.roundStartCountdown;
        }
        
        const elapsedSeconds = delta / 1000;
        countdown.current -= elapsedSeconds;
        
        if (countdown.current <= 0) {
          countdown.current = null;
          gameState.initializeRound();
        }
      } else {
        // Normal game update
        // Apply the ballSpeed setting as a multiplier to make physics adjustable
        for (let i = 0; i < Math.ceil(delta / 16); i++) {
          gameState.update(ballSpeed);
        }
      }
      
      if (gameState.phase === 'game') {
        requestAnimationFrame(updateGame);
      }
    };
    
    // Start the game loop
    const frameId = requestAnimationFrame(updateGame);
    
    // Reset countdown on initial render
    if (gameState.roundStartCountdown !== null) {
      countdown.current = ROUND_START_COUNTDOWN;
    }
    
    return () => {
      cancelAnimationFrame(frameId);
      lastTime.current = 0;
    };
  }, [gameState, gameState.phase, ballSpeed]);
  
  // Reset countdown when starting a new round
  useEffect(() => {
    if (gameState.roundStartCountdown !== null) {
      countdown.current = gameState.roundStartCountdown;
    }
  }, [gameState.roundStartCountdown]);
  
  return {
    currentCountdown: countdown.current
  };
}
