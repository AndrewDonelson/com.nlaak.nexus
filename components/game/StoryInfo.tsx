import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StoryInfoProps {
  title: string;
  playerName: string;
  alignment: number;
}

const StoryInfo: React.FC<StoryInfoProps> = ({ title, playerName, alignment }) => {
  return (
    <Card className="w-full h-full animate-in fade-in duration-300">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Player: {playerName}</p>
        <p className="text-sm">Alignment: {alignment}</p>
      </CardContent>
    </Card>
  );
};

export default StoryInfo;