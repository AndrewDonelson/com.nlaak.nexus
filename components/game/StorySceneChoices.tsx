import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Choice {
  id: string;
  text: string;
}

interface StorySceneChoicesProps {
  choices: Choice[];
  onChoiceSelect: (choiceId: string) => void;
  onGoBack: () => void;
  canGoBack: boolean;
}

const StorySceneChoices: React.FC<StorySceneChoicesProps> = ({ choices, onChoiceSelect, onGoBack, canGoBack }) => {
  return (
    <Card className="animate-in slide-in-from-bottom duration-300 delay-150">
      <CardHeader>
        <CardTitle>Choices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {choices.length > 0 ? (
            choices.map((choice) => (
              <Button
                key={choice.id}
                onClick={() => onChoiceSelect(choice.id)}
                className="w-full animate-in fade-in duration-300"
              >
                {choice.text}
              </Button>
            ))
          ) : (
            <p>No choices available for this scene.</p>
          )}
          {canGoBack && (
            <Button
              onClick={onGoBack}
              className="w-full bg-secondary hover:bg-secondary/80 animate-in fade-in duration-300"
            >
              Go Back
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StorySceneChoices;