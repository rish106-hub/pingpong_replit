import { Suspense, useEffect } from "react";
import { MainMenu } from "./components/menus/MainMenu";
import { GameScene } from "./components/game/GameScene";
import { GameUI } from "./components/ui/GameUI";
import { usePongGame } from "./lib/stores/usePongGame";
import { useAudio } from "./lib/stores/useAudio";
import { useSettings } from "./lib/stores/useSettings";
import { SOUNDS } from "./lib/constants";

function App() {
  const gamePhase = usePongGame(state => state.phase);
  const { 
    setBackgroundMusic, 
    setHitSound, 
    setSuccessSound, 
    toggleMute,
    isMuted
  } = useAudio();
  
  const { soundEnabled, musicEnabled } = useSettings();
  
  // Initialize audio assets
  useEffect(() => {
    // Load and set up background music
    const bgMusic = new Audio(SOUNDS.BACKGROUND);
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    setBackgroundMusic(bgMusic);
    
    // Load and set up sound effects
    const hit = new Audio(SOUNDS.PADDLE_HIT);
    hit.volume = 0.5;
    setHitSound(hit);
    
    const success = new Audio(SOUNDS.SCORE);
    success.volume = 0.6;
    setSuccessSound(success);
    
    // Toggle mute based on initial settings
    if (!soundEnabled && !isMuted) {
      toggleMute();
    }
    
    // Start background music if enabled
    if (musicEnabled && soundEnabled) {
      bgMusic.play().catch(err => console.log("Audio autoplay prevented:", err));
    }
    
    // Cleanup on unmount
    return () => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    };
  }, []);
  
  // Handle changes to sound settings
  useEffect(() => {
    if (isMuted === soundEnabled) {
      toggleMute();
    }
    
    // Handle background music
    const bgMusic = useAudio.getState().backgroundMusic;
    if (bgMusic) {
      if (musicEnabled && soundEnabled) {
        bgMusic.play().catch(err => console.log("Audio play prevented:", err));
      } else {
        bgMusic.pause();
      }
    }
  }, [soundEnabled, musicEnabled]);

  return (
    <div className="w-full h-full">
      <Suspense fallback={<div>Loading...</div>}>
        {/* The 3D game scene is always rendered */}
        <GameScene />
        
        {/* Show the appropriate UI based on game phase */}
        {gamePhase === 'menu' && <MainMenu />}
        
        {/* Game UI is shown during gameplay phases */}
        {(gamePhase === 'game' || gamePhase === 'pause' || gamePhase === 'gameOver') && (
          <GameUI />
        )}
      </Suspense>
    </div>
  );
}

export default App;
