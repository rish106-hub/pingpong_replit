import { useEffect, useRef } from 'react';
import { usePongGame } from '@/lib/stores/usePongGame';
import { useSettings } from '@/lib/stores/useSettings';
import { ROUND_START_COUNTDOWN } from '@/lib/constants';

export function useGamePhysics() {
  // Use refs to avoid unnecessary re-renders
  const phaseRef = useRef('menu');
  const countdownRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const frameIdRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);
  
  // Initialize the physics engine
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;
    
    // Function to get current game state
    const getGameState = () => usePongGame.getState();
    const getSettings = () => useSettings.getState();
    
    // Initial values
    phaseRef.current = getGameState().phase;
    
    // Set up subscription to game phase changes
    const unsubscribePhase = usePongGame.subscribe(
      state => state.phase,
      (phase) => {
        phaseRef.current = phase;
        
        // Start or stop game loop based on phase
        if (phase === 'game') {
          startGameLoop();
        } else if (frameIdRef.current) {
          cancelAnimationFrame(frameIdRef.current);
          frameIdRef.current = null;
        }
      }
    );
    
    // Set up subscription to countdown changes
    const unsubscribeCountdown = usePongGame.subscribe(
      state => state.roundStartCountdown,
      (countdown) => {
        countdownRef.current = countdown;
      }
    );
    
    // Game loop function
    const gameLoop = (time: number) => {
      const gameState = getGameState();
      
      // Skip if not in game phase
      if (gameState.phase !== 'game') {
        frameIdRef.current = null;
        return;
      }
      
      // Initialize lastTime on first frame
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
        frameIdRef.current = requestAnimationFrame(gameLoop);
        return;
      }
      
      // Calculate delta time
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;
      
      // Handle countdown timer
      if (gameState.roundStartCountdown !== null) {
        const localCountdown = countdownRef.current !== null 
          ? countdownRef.current 
          : gameState.roundStartCountdown;
        
        const elapsedSeconds = delta / 1000;
        const newCountdown = localCountdown - elapsedSeconds;
        
        countdownRef.current = newCountdown;
        
        if (newCountdown <= 0) {
          countdownRef.current = null;
          gameState.initializeRound();
        }
      } else {
        // Normal game update
        const settings = getSettings();
        // Apply the ballSpeed setting as a multiplier
        for (let i = 0; i < Math.ceil(delta / 16); i++) {
          gameState.update(settings.ballSpeed);
        }
      }
      
      // Continue the game loop if still in game phase
      if (getGameState().phase === 'game') {
        frameIdRef.current = requestAnimationFrame(gameLoop);
      } else {
        frameIdRef.current = null;
      }
    };
    
    // Function to start the game loop
    const startGameLoop = () => {
      // Only start if not already running
      if (!frameIdRef.current) {
        lastTimeRef.current = 0; // Reset time tracker
        frameIdRef.current = requestAnimationFrame(gameLoop);
      }
    };
    
    // Start game loop if already in game phase
    if (phaseRef.current === 'game') {
      startGameLoop();
    }
    
    // Cleanup function
    return () => {
      unsubscribePhase();
      unsubscribeCountdown();
      
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
      }
    };
  }, []); // Empty dependency array - run only once
  
  // Just return the current countdown for display purposes
  return {
    currentCountdown: countdownRef.current
  };
}
