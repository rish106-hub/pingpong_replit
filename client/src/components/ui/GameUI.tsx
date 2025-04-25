import { useState, useEffect, useRef, memo } from 'react';
import { usePongGame } from '@/lib/stores/usePongGame';
import { COLORS } from '@/lib/constants';
import { Button } from './button';
import { useSettings } from '@/lib/stores/useSettings';
import { useAudio } from '@/lib/stores/useAudio';
import { Volume2, VolumeX, Pause, Play, RotateCcw, Home } from 'lucide-react';

// FPS counter as a separate, memoized component
const FpsCounter = memo(() => {
  const showFps = useSettings(state => state.showFps);
  const [fps, setFps] = useState(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const frameIdRef = useRef<number | null>(null);
  
  // Calculate FPS
  useEffect(() => {
    if (!showFps) return;
    
    let counting = true;
    
    const countFrames = () => {
      frameCountRef.current += 1;
      if (counting) {
        frameIdRef.current = requestAnimationFrame(countFrames);
      }
    };
    
    const updateFps = () => {
      const now = performance.now();
      const elapsed = now - lastTimeRef.current;
      
      if (elapsed > 0) {
        setFps(Math.round((frameCountRef.current * 1000) / elapsed));
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
    };
    
    // Start counting frames
    frameIdRef.current = requestAnimationFrame(countFrames);
    
    // Update FPS once per second
    const intervalId = setInterval(updateFps, 1000);
    
    return () => {
      counting = false;
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      clearInterval(intervalId);
    };
  }, [showFps]);
  
  if (!showFps) return null;
  
  return (
    <div className="absolute top-2 left-2 text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded">
      FPS: {fps}
    </div>
  );
});

// Main GameUI component
export function GameUI() {
  const gameState = usePongGame();
  const { soundEnabled, toggleSound } = useSettings();
  const showFps = useSettings(state => state.showFps);
  
  // Function to render the score display
  const renderScoreDisplay = () => {
    return (
      <div className="absolute top-5 left-0 right-0 flex justify-center">
        <div className="flex items-center bg-black bg-opacity-50 px-6 py-3 rounded-full">
          <div className="text-2xl font-bold text-white min-w-[50px] text-right">
            {gameState.score.player}
          </div>
          <div className="mx-3 text-xl text-white">:</div>
          <div className="text-2xl font-bold text-white min-w-[50px] text-left">
            {gameState.score.ai}
          </div>
        </div>
      </div>
    );
  };
  
  // Function to render the countdown overlay
  const renderCountdown = () => {
    if (gameState.phase !== 'game' || gameState.roundStartCountdown === null) return null;
    
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-9xl font-bold text-white opacity-70">
          {Math.ceil(gameState.roundStartCountdown)}
        </div>
      </div>
    );
  };
  
  // Function to render the pause menu
  const renderPauseMenu = () => {
    if (gameState.phase !== 'pause') return null;
    
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-gray-900 p-8 rounded-lg shadow-xl flex flex-col items-center gap-4 w-80">
          <h2 className="text-3xl font-bold text-white mb-4">Game Paused</h2>
          
          <Button 
            className="w-full" 
            onClick={() => gameState.resumeGame()}
          >
            <Play className="mr-2 h-4 w-4" /> Resume Game
          </Button>
          
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => gameState.resetGame()}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Restart Game
          </Button>
          
          <Button 
            className="w-full" 
            variant="destructive"
            onClick={() => gameState.returnToMenu()}
          >
            <Home className="mr-2 h-4 w-4" /> Return to Menu
          </Button>
        </div>
      </div>
    );
  };
  
  // Function to render the game over screen
  const renderGameOver = () => {
    if (gameState.phase !== 'gameOver') return null;
    
    const winner = gameState.winner === 'player' ? 'You win!' : 'AI wins!';
    const score = `${gameState.score.player} - ${gameState.score.ai}`;
    
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-gray-900 p-8 rounded-lg shadow-xl flex flex-col items-center gap-4 w-80">
          <h2 className="text-3xl font-bold text-white">{winner}</h2>
          <p className="text-xl text-gray-300 mb-4">Final Score: {score}</p>
          
          <Button 
            className="w-full" 
            onClick={() => gameState.resetGame()}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Play Again
          </Button>
          
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => gameState.returnToMenu()}
          >
            <Home className="mr-2 h-4 w-4" /> Return to Menu
          </Button>
        </div>
      </div>
    );
  };
  
  // Game controls for in-game UI
  const renderGameControls = () => {
    if (gameState.phase !== 'game') return null;
    
    return (
      <div className="absolute top-5 right-5 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="bg-black bg-opacity-50 hover:bg-opacity-70 border-none"
          onClick={toggleSound}
        >
          {soundEnabled ? (
            <Volume2 className="h-5 w-5 text-white" />
          ) : (
            <VolumeX className="h-5 w-5 text-white" />
          )}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="bg-black bg-opacity-50 hover:bg-opacity-70 border-none"
          onClick={() => gameState.pauseGame()}
        >
          <Pause className="h-5 w-5 text-white" />
        </Button>
      </div>
    );
  };
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Use our new FpsCounter component */}
      <FpsCounter />
      
      {/* Only show score during gameplay */}
      {(gameState.phase === 'game' || gameState.phase === 'pause') && renderScoreDisplay()}
      
      {/* Game controls and buttons */}
      <div className="pointer-events-auto">
        {renderGameControls()}
        {renderCountdown()}
        {renderPauseMenu()}
        {renderGameOver()}
      </div>
    </div>
  );
}