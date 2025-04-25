import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { usePongGame } from '@/lib/stores/usePongGame';
import { MathUtils } from 'three';
import { COLORS } from '@/lib/constants';

export function Ball() {
  const ball = usePongGame(state => state.ball);
  const phase = usePongGame(state => state.phase);
  const roundStartCountdown = usePongGame(state => state.roundStartCountdown);
  
  // Reference to the mesh for animation
  const ballRef = useRef<THREE.Mesh>(null);
  
  // Smooth out the ball movement
  useFrame(() => {
    if (!ballRef.current || phase !== 'game' || roundStartCountdown !== null) return;
    
    // Smoothly interpolate the ball position
    ballRef.current.position.x = MathUtils.lerp(ballRef.current.position.x, ball.position.x, 0.3);
    ballRef.current.position.y = MathUtils.lerp(ballRef.current.position.y, ball.position.y, 0.3);
    
    // Add a little spin based on the ball's velocity
    ballRef.current.rotation.z += ball.velocity.x * 0.02;
  });
  
  return (
    <mesh
      ref={ballRef}
      position={[ball.position.x, ball.position.y, 1]}
      visible={phase === 'game'}
    >
      <sphereGeometry args={[ball.radius, 32, 32]} />
      <meshStandardMaterial color={COLORS.BALL} roughness={0.2} metalness={0.1} />
    </mesh>
  );
}
