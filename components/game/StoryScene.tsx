import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StorySceneProps {
  content: string;
}

const StoryScene: React.FC<StorySceneProps> = ({ content }) => {
  return (
    <Card className="mb-4 animate-in slide-in-from-bottom duration-300">
      <CardHeader>
        <CardTitle>Current Scene</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          <p>{content}</p>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default StoryScene;