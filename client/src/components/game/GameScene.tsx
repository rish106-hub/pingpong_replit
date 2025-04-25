import { useEffect, useRef, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { COLORS, COURT_HEIGHT, COURT_WIDTH } from '@/lib/constants';

import { Court } from './Court';
import { Ball } from './Ball';
import { Paddle } from './Paddle';
import { AIController } from './AIController';
import { useGameControls } from '@/hooks/useGameControls';

// Import the hook directly to avoid using require
import { useGamePhysics } from '@/hooks/useGamePhysics';

// Define a separate component for the game physics to avoid re-renders
const GamePhysics = memo(() => {
  useGamePhysics();
  return null;
});

// Wrap the scene in memo to prevent unnecessary re-renders
export const GameScene = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize controls
  useGameControls();
  
  // Set canvas dimensions only on mount and resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.style.width = '100%';
        canvasRef.current.style.height = '100%';
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array to only run on mount
  
  return (
    <Canvas ref={canvasRef} style={{ background: COLORS.BACKGROUND }}>
      {/* Orthographic camera for 2D view */}
      <OrthographicCamera
        makeDefault
        position={[COURT_WIDTH / 2, COURT_HEIGHT / 2, 500]}
        zoom={1}
        near={0.1}
        far={1000}
        left={0}
        right={COURT_WIDTH}
        top={COURT_HEIGHT}
        bottom={0}
      />
      
      {/* Simple lighting setup */}
      <ambientLight intensity={0.5} />
      <pointLight position={[COURT_WIDTH / 2, COURT_HEIGHT / 2, 150]} intensity={0.8} />
      
      {/* Game elements */}
      <Court />
      <Paddle type="player" />
      <Paddle type="ai" />
      <Ball />
      
      {/* AI controller (no visual elements) */}
      <AIController />
      
      {/* Game physics (separate component) */}
      <GamePhysics />
    </Canvas>
  );
});
