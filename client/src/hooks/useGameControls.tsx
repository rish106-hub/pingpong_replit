import { useEffect, useState } from 'react';
import { usePongGame } from '@/lib/stores/usePongGame';
import { useSettings } from '@/lib/stores/useSettings';

export function useGameControls() {
  const [mouseY, setMouseY] = useState<number | null>(null);
  const [touchY, setTouchY] = useState<number | null>(null);
  const gameState = usePongGame();
  const { paddleSensitivity } = useSettings();
  
  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Space':
          if (gameState.phase === 'menu') {
            gameState.startGame();
          } else if (gameState.phase === 'game') {
            gameState.pauseGame();
          } else if (gameState.phase === 'pause') {
            gameState.resumeGame();
          } else if (gameState.phase === 'gameOver') {
            gameState.resetGame();
          }
          break;
          
        case 'Escape':
          if (gameState.phase === 'game' || gameState.phase === 'pause') {
            gameState.returnToMenu();
          }
          break;
          
        case 'KeyR':
          if (gameState.phase === 'gameOver') {
            gameState.resetGame();
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);
  
  // Handle mouse movement for paddle control
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (gameState.phase !== 'game') return;
      
      // Get the y-coordinate relative to the game container
      const canvasRect = document.querySelector('canvas')?.getBoundingClientRect();
      if (canvasRect) {
        const relativeY = (e.clientY - canvasRect.top) * (gameState.playerPaddle.height * 5 / canvasRect.height);
        setMouseY(relativeY * paddleSensitivity);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [gameState.phase, gameState.playerPaddle.height, paddleSensitivity]);
  
  // Handle touch movement for paddle control on mobile
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (gameState.phase !== 'game' || e.touches.length === 0) return;
      
      // Prevent scrolling when touching the game
      e.preventDefault();
      
      // Get the y-coordinate relative to the game container
      const canvasRect = document.querySelector('canvas')?.getBoundingClientRect();
      if (canvasRect) {
        const touch = e.touches[0];
        const relativeY = (touch.clientY - canvasRect.top) * (gameState.playerPaddle.height * 5 / canvasRect.height);
        setTouchY(relativeY * paddleSensitivity);
      }
    };
    
    // Add both touchmove and touchstart event listeners
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchstart', handleTouchMove, { passive: false });
    
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
    };
  }, [gameState.phase, gameState.playerPaddle.height, paddleSensitivity]);
  
  // Update paddle position based on input
  useEffect(() => {
    if (gameState.phase !== 'game') return;
    
    // Use either mouse or touch position, prioritizing touch if available
    const inputY = touchY !== null ? touchY : mouseY;
    
    if (inputY !== null) {
      gameState.movePaddle('player', inputY);
    }
  }, [mouseY, touchY, gameState]);
  
  return null;
}
