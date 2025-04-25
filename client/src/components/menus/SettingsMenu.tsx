import { useSettings } from '@/lib/stores/useSettings';
import { usePlayer } from '@/lib/stores/usePlayer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, RotateCcw, Volume2, VolumeX, Music, Activity } from 'lucide-react';
import { DifficultyLevel } from '@/lib/types';
import { COLORS } from '@/lib/constants';

interface SettingsMenuProps {
  onBack: () => void;
}

export function SettingsMenu({ onBack }: SettingsMenuProps) {
  const settings = useSettings();
  const playerStats = usePlayer();
  
  return (
    <div className="absolute inset-0 flex items-center justify-center" 
         style={{ backgroundColor: COLORS.BACKGROUND }}>
      <div className="flex flex-col items-start max-w-md w-full px-4">
        {/* Header */}
        <div className="flex items-center w-full mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-6 w-6" style={{ color: COLORS.TEXT }} />
          </Button>
          <h1 className="text-2xl font-bold ml-2" style={{ color: COLORS.TEXT }}>
            Settings
          </h1>
        </div>
        
        {/* Sound Settings */}
        <div className="w-full mb-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.TEXT }}>
            Sound
          </h2>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Volume2 className="h-5 w-5 mr-2" style={{ color: COLORS.TEXT }} />
              <Label htmlFor="sound-toggle" style={{ color: COLORS.TEXT }}>Sound Effects</Label>
            </div>
            <Switch 
              id="sound-toggle" 
              checked={settings.soundEnabled}
              onCheckedChange={settings.toggleSound}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Music className="h-5 w-5 mr-2" style={{ color: COLORS.TEXT }} />
              <Label htmlFor="music-toggle" style={{ color: COLORS.TEXT }}>Background Music</Label>
            </div>
            <Switch 
              id="music-toggle" 
              checked={settings.musicEnabled}
              onCheckedChange={settings.toggleMusic}
            />
          </div>
        </div>
        
        {/* Game Settings */}
        <div className="w-full mb-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.TEXT }}>
            Game
          </h2>
          
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <Label htmlFor="paddle-sensitivity" style={{ color: COLORS.TEXT }}>
                Paddle Sensitivity
              </Label>
              <span style={{ color: COLORS.TEXT }}>
                {settings.paddleSensitivity.toFixed(1)}x
              </span>
            </div>
            <Slider 
              id="paddle-sensitivity"
              min={0.5}
              max={2.0}
              step={0.1}
              value={[settings.paddleSensitivity]}
              onValueChange={(value) => settings.setPaddleSensitivity(value[0])}
            />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <Label htmlFor="ball-speed" style={{ color: COLORS.TEXT }}>
                Ball Speed
              </Label>
              <span style={{ color: COLORS.TEXT }}>
                {settings.ballSpeed.toFixed(1)}x
              </span>
            </div>
            <Slider 
              id="ball-speed"
              min={0.5}
              max={2.0}
              step={0.1}
              value={[settings.ballSpeed]}
              onValueChange={(value) => settings.setBallSpeed(value[0])}
            />
          </div>
          
          <div>
            <Label className="block mb-2" style={{ color: COLORS.TEXT }}>
              AI Difficulty
            </Label>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard', 'pro'] as DifficultyLevel[]).map((level) => (
                <Button
                  key={level}
                  variant={settings.aiDifficulty === level ? "default" : "outline"}
                  className="flex-1 capitalize"
                  onClick={() => settings.setAiDifficulty(level)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Display Settings */}
        <div className="w-full mb-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.TEXT }}>
            Display
          </h2>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-5 w-5 mr-2" style={{ color: COLORS.TEXT }} />
              <Label htmlFor="fps-toggle" style={{ color: COLORS.TEXT }}>Show FPS</Label>
            </div>
            <Switch 
              id="fps-toggle" 
              checked={settings.showFps}
              onCheckedChange={settings.toggleFps}
            />
          </div>
        </div>
        
        {/* Player Stats Reset */}
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.TEXT }}>
            Player Statistics
          </h2>
          
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex justify-between">
              <span style={{ color: COLORS.TEXT }}>Games Played:</span>
              <span style={{ color: COLORS.TEXT }}>{playerStats.gamesPlayed}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: COLORS.TEXT }}>Games Won:</span>
              <span style={{ color: COLORS.TEXT }}>{playerStats.gamesWon}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: COLORS.TEXT }}>Highest Score:</span>
              <span style={{ color: COLORS.TEXT }}>{playerStats.highestScore}</span>
            </div>
          </div>
          
          <Button 
            variant="destructive"
            className="w-full"
            onClick={() => {
              if (confirm('Are you sure you want to reset all your stats?')) {
                playerStats.resetStats();
              }
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset Stats
          </Button>
        </div>
        
        {/* Reset all settings */}
        <Button 
          variant="outline"
          className="w-full mt-6"
          onClick={() => {
            if (confirm('Are you sure you want to reset all settings to defaults?')) {
              settings.resetToDefaults();
            }
          }}
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset All Settings
        </Button>
      </div>
    </div>
  );
}
