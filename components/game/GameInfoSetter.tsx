import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

/**
 * Represents the necessary information for a game, including its genre, theme, and any additional information.
 */
interface GameInfo {
  genre: string;
  theme: string;
  additionalInfo: string;
}

/**
 * Represents the props for the `GameInfoSetter` component, which includes a callback function `onInfoSet` that is called when the game information is set.
 */
interface GameInfoSetterProps {
  onInfoSet: (info: GameInfo) => void;
}

/**
 * Represents a React component that allows the user to set the necessary information for a game, including its genre, theme, and any additional information.
 *
 * The component takes in a `onInfoSet` callback function that is called when the game information is set by the user.
 *
 * The component renders a form with input fields for the genre, theme, and additional information, and a submit button to save the information.
 */
const GameInfoSetter: React.FC<GameInfoSetterProps> = ({ onInfoSet }) => {
  const [gameInfo, setGameInfo] = useState<GameInfo>({
    genre: '',
    theme: '',
    additionalInfo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGameInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInfoSet(gameInfo);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-background text-foreground rounded-lg shadow-md animate-in fade-in duration-300">
      <div className="space-y-2">
        <label htmlFor="genre" className="block text-sm font-medium">
          Genre
        </label>
        <Input
          type="text"
          id="genre"
          name="genre"
          value={gameInfo.genre}
          onChange={handleChange}
          required
          className="w-full animate-in slide-in-from-left duration-300"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="theme" className="block text-sm font-medium">
          Theme
        </label>
        <Input
          type="text"
          id="theme"
          name="theme"
          value={gameInfo.theme}
          onChange={handleChange}
          required
          className="w-full animate-in slide-in-from-right duration-300"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="additionalInfo" className="block text-sm font-medium">
          Additional Information
        </label>
        <Input
          type="text"
          id="additionalInfo"
          name="additionalInfo"
          value={gameInfo.additionalInfo}
          onChange={handleChange}
          className="w-full animate-in slide-in-from-bottom duration-300"
        />
      </div>
      <Button type="submit" className="w-full animate-in zoom-in duration-300">Set Game Information</Button>
    </form>
  );
};

export default GameInfoSetter;