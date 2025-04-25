import { useState } from 'react';
import { usePongGame } from '@/lib/stores/usePongGame';
import { useSettings } from '@/lib/stores/useSettings';
import { usePlayer } from '@/lib/stores/usePlayer';
import { Button } from '@/components/ui/button';
import { Play, Settings, Info, Trophy, Volume2, VolumeX } from 'lucide-react';
import { DifficultyLevel } from '@/lib/types';
import { COLORS } from '@/lib/constants';
import { SettingsMenu } from './SettingsMenu';

export function MainMenu() {
  const gameState = usePongGame();
  const settingsState = useSettings();
  const playerState = usePlayer();
  const [showSettings, setShowSettings] = useState(false);
  
  const handleStartGame = () => {
    gameState.startGame();
    playerState.incrementGamesPlayed();
  };
  
  const handleDifficultyChange = (level: DifficultyLevel) => {
    settingsState.setAiDifficulty(level);
  };
  
  // Main menu view
  if (!showSettings) {
    return (
      <div className="absolute inset-0 flex items-center justify-center" 
           style={{ backgroundColor: COLORS.BACKGROUND }}>
        <div className="flex flex-col items-center max-w-md w-full px-4">
          {/* Logo */}
          <h1 className="text-6xl font-bold mb-2" style={{ color: COLORS.TEXT }}>
            Repli<span style={{ color: COLORS.BALL }}>Pong</span>
          </h1>
          <p className="text-lg mb-8 text-center opacity-80" style={{ color: COLORS.TEXT }}>
            A fast-paced ping pong game with realistic physics
          </p>
          
          {/* Game start button */}
          <Button 
            className="w-full mb-3 text-lg py-6 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
            onClick={handleStartGame}
          >
            <Play className="mr-2 h-5 w-5" /> Play Game
          </Button>
          
          {/* Difficulty selector */}
          <div className="mb-6 w-full">
            <p className="text-sm mb-2 text-center" style={{ color: COLORS.TEXT }}>
              Difficulty
            </p>
            <div className="flex gap-2 justify-center w-full">
              {(['easy', 'medium', 'hard', 'pro'] as DifficultyLevel[]).map((level) => (
                <Button
                  key={level}
                  variant={settingsState.aiDifficulty === level ? "default" : "outline"}
                  className="flex-1 capitalize"
                  onClick={() => handleDifficultyChange(level)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Sound toggle button */}
          <Button
            variant="outline"
            className="mb-6 w-full"
            onClick={settingsState.toggleSound}
          >
            {settingsState.soundEnabled ? (
              <>
                <Volume2 className="mr-2 h-5 w-5" /> Sound On
              </>
            ) : (
              <>
                <VolumeX className="mr-2 h-5 w-5" /> Sound Off
              </>
            )}
          </Button>
          
          {/* Settings button */}
          <Button 
            variant="outline"
            className="w-full mb-3"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="mr-2 h-5 w-5" /> Settings
          </Button>
          
          {/* Player stats summary */}
          <div className="mt-8 w-full p-4 rounded-lg bg-black bg-opacity-20">
            <div className="flex justify-between mb-2">
              <span style={{ color: COLORS.TEXT }}>Games Played:</span>
              <span style={{ color: COLORS.TEXT }}>{playerState.gamesPlayed}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: COLORS.TEXT }}>Games Won:</span>
              <span style={{ color: COLORS.TEXT }}>{playerState.gamesWon}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Show settings menu if settings is active
  return <SettingsMenu onBack={() => setShowSettings(false)} />;
}
