import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { usePongGame } from '@/lib/stores/usePongGame';
import { COLORS, COURT_HEIGHT, COURT_WIDTH } from '@/lib/constants';

import { Court } from './Court';
import { Ball } from './Ball';
import { Paddle } from './Paddle';
import { AIController } from './AIController';
import { useGamePhysics } from '@/hooks/useGamePhysics';
import { useGameControls } from '@/hooks/useGameControls';

export function GameScene() {
  const gameState = usePongGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize game physics and controls
  useGamePhysics();
  useGameControls();
  
  // Set canvas dimensions when window resizes
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
  }, []);
  
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
    </Canvas>
  );
}
