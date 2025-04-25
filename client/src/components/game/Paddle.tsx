import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePongGame } from '@/lib/stores/usePongGame';
import { COLORS } from '@/lib/constants';

interface PaddleProps {
  type: 'player' | 'ai';
}

export function Paddle({ type }: PaddleProps) {
  const paddle = usePongGame(state => 
    type === 'player' ? state.playerPaddle : state.aiPaddle
  );
  
  const phase = usePongGame(state => state.phase);
  
  // Reference to the mesh for animation
  const paddleRef = useRef<THREE.Mesh>(null);
  const targetPositionRef = useRef<THREE.Vector3>(new THREE.Vector3(
    paddle.position.x,
    paddle.position.y,
    0
  ));
  
  // Set initial position
  useEffect(() => {
    if (paddleRef.current) {
      paddleRef.current.position.set(
        paddle.position.x,
        paddle.position.y,
        0
      );
    }
  }, []);
  
  // Update the target position when the paddle position changes
  useEffect(() => {
    targetPositionRef.current.set(
      paddle.position.x,
      paddle.position.y,
      0
    );
  }, [paddle.position]);
  
  // Smoothly animate the paddle
  useFrame(() => {
    if (!paddleRef.current || phase !== 'game') return;
    
    // Smoothly interpolate to target position
    paddleRef.current.position.y = THREE.MathUtils.lerp(
      paddleRef.current.position.y,
      targetPositionRef.current.y,
      0.2
    );
  });
  
  return (
    <mesh
      ref={paddleRef}
      position={[paddle.position.x, paddle.position.y, 0]}
      visible={phase === 'game' || phase === 'pause' || phase === 'gameOver'}
    >
      <boxGeometry args={[paddle.width, paddle.height, 10]} />
      <meshStandardMaterial color={COLORS.PADDLE} roughness={0.2} metalness={0.3} />
    </mesh>
  );
}
