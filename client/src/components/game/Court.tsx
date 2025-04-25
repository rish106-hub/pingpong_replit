import { COLORS, COURT_HEIGHT, COURT_WIDTH } from '@/lib/constants';

export function Court() {
  return (
    <group>
      {/* Court background */}
      <mesh position={[COURT_WIDTH / 2, COURT_HEIGHT / 2, -1]}>
        <planeGeometry args={[COURT_WIDTH, COURT_HEIGHT]} />
        <meshStandardMaterial color={COLORS.COURT} />
      </mesh>
      
      {/* Center line */}
      <mesh position={[COURT_WIDTH / 2, COURT_HEIGHT / 2, 0]}>
        <planeGeometry args={[2, COURT_HEIGHT]} />
        <meshStandardMaterial color={COLORS.NET} transparent opacity={0.3} />
      </mesh>
      
      {/* Center circle */}
      <mesh position={[COURT_WIDTH / 2, COURT_HEIGHT / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[30, 35, 32]} />
        <meshStandardMaterial color={COLORS.NET} transparent opacity={0.2} />
      </mesh>
      
      {/* Court border - top */}
      <mesh position={[COURT_WIDTH / 2, COURT_HEIGHT + 2.5, 0]}>
        <boxGeometry args={[COURT_WIDTH + 20, 5, 5]} />
        <meshStandardMaterial color={COLORS.NET} />
      </mesh>
      
      {/* Court border - bottom */}
      <mesh position={[COURT_WIDTH / 2, -2.5, 0]}>
        <boxGeometry args={[COURT_WIDTH + 20, 5, 5]} />
        <meshStandardMaterial color={COLORS.NET} />
      </mesh>
      
      {/* Court border - left */}
      <mesh position={[-10, COURT_HEIGHT / 2, 0]}>
        <boxGeometry args={[5, COURT_HEIGHT + 20, 5]} />
        <meshStandardMaterial color={COLORS.NET} />
      </mesh>
      
      {/* Court border - right */}
      <mesh position={[COURT_WIDTH + 10, COURT_HEIGHT / 2, 0]}>
        <boxGeometry args={[5, COURT_HEIGHT + 20, 5]} />
        <meshStandardMaterial color={COLORS.NET} />
      </mesh>
    </group>
  );
}
