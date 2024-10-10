'use client'

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { debug } from '@/lib/utils';
import StoryProgressMap from '@/components/game/StoryProgressMap';
import { StoryNode } from '@/lib/game/types';

export default function GamePlayPage() {
  const [sessionId, setSessionId] = useState<Id<"nexusGameSessions"> | null>(null);
  const [playerId, setPlayerId] = useState<Id<"players"> | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<Id<"storyNodes"> | null>(null);

  const session = useQuery(api.nexusEngine.getNexusGameSession, sessionId ? { sessionId } : 'skip');
  const player = useQuery(api.nexusEngine.getPlayer, playerId ? { playerId } : 'skip');
  const currentNode = useQuery(api.nexusEngine.getStoryNode, currentNodeId ? { nodeId: currentNodeId } : 'skip');
  const allNodes = useQuery(api.nexusEngine.getAllStoryNodes) as StoryNode[] | undefined;
  const makeChoice = useMutation(api.nexusEngine.makeChoice);
  const goBack = useMutation(api.nexusEngine.goBack);
  const updatePoliticalAlignment = useMutation(api.nexusEngine.updatePoliticalAlignment);
  const createPlayer = useMutation(api.nexusEngine.createPlayer);
  const createNexusGameSession = useMutation(api.nexusEngine.createNexusGameSession);

  useEffect(() => {
    debug('GamePlayPage', 'Component mounted');
    const createOrRetrieveSession = async () => {
      debug('GamePlayPage', 'Creating or retrieving session');
      if (allNodes && allNodes.length > 0) {
        debug('GamePlayPage', `Found ${allNodes.length} story nodes`);
        const newPlayerId = await createPlayer({
          name: "Test Player",
          description: "A test player for the game"
        });
        debug('GamePlayPage', `Created new player with ID: ${newPlayerId}`);
        const newSessionId = await createNexusGameSession({
          playerId: newPlayerId,
          startingNodeId: allNodes[0]._id,
          title: "Test Game Session"
        });
        debug('GamePlayPage', `Created new session with ID: ${newSessionId}`);
        setPlayerId(newPlayerId);
        setSessionId(newSessionId);
        setCurrentNodeId(allNodes[0]._id);
      } else {
        debug('GamePlayPage', 'No story nodes found');
      }
    };

    createOrRetrieveSession();
  }, [allNodes, createPlayer, createNexusGameSession]);

  useEffect(() => {
    if (session) {
      debug('GamePlayPage', `Session updated, current node: ${session.currentNodeId}`);
      setCurrentNodeId(session.currentNodeId);
    }
  }, [session]);

  const handleChoice = async (choiceId: string) => {
    debug('GamePlayPage', `Handling choice: ${choiceId}`);
    if (!sessionId || !currentNode) {
      debug('GamePlayPage', 'Error: sessionId or currentNode is null');
      return;
    }

    try {
      const choice = currentNode.choices.find(c => c.id === choiceId);
      if (!choice) {
        debug('GamePlayPage', `Error: Choice with id ${choiceId} not found`);
        return;
      }

      debug('GamePlayPage', `Making choice: ${choiceId}`);
      await makeChoice({ sessionId, choiceId });
      debug('GamePlayPage', `Choice made: ${choiceId}`);

      if (playerId) {
        const politicalChanges = choice.consequences
          .filter(c => c.type === 'changePoliticalValue')
          .reduce((acc, c) => {
            if (c.type === 'changePoliticalValue' && typeof c.value === 'number') {
              acc[c.target] = c.value;
            }
            return acc;
          }, {} as Record<string, number>);
        
        if (Object.keys(politicalChanges).length > 0) {
          debug('GamePlayPage', `Updating political alignment: ${JSON.stringify(politicalChanges)}`);
          await updatePoliticalAlignment({ playerId, changes: politicalChanges });
        }
      }

      // The session will be automatically updated due to the reactive nature of Convex
    } catch (error) {
      debug('GamePlayPage', `Error in handleChoice: ${error}`);
    }
  };

  const handleGoBack = async () => {
    debug('GamePlayPage', 'Attempting to go back');
    if (!sessionId) {
      debug('GamePlayPage', 'Error: sessionId is null');
      return;
    }

    try {
      await goBack({ sessionId });
      debug('GamePlayPage', 'Successfully went back to previous node');
      // The session will be automatically updated due to the reactive nature of Convex
    } catch (error) {
      debug('GamePlayPage', `Error in handleGoBack: ${error}`);
    }
  };

  if (!session || !player || !currentNode || !allNodes) {
    debug('GamePlayPage', 'Data not loaded yet');
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 mt-12 flex">
      <div className="w-1/4 pr-4">
        <StoryProgressMap
          nodes={allNodes}
          currentNodeId={currentNodeId}
          visitedNodes={session.visitedNodes}
        />
      </div>
      <div className="w-3/4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{session.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Player: {player.name}</p>
            <p>Alignment: {player.politicalAlignment.overallAlignment}</p>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Current Scene</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <p>{currentNode.content}</p>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Choices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {currentNode.choices.map((choice) => (
                <Button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className="w-full"
                >
                  {choice.text}
                </Button>
              ))}
              {currentNode.parentNodeId && (
                <Button
                  onClick={handleGoBack}
                  className="w-full bg-gray-500 hover:bg-gray-600"
                >
                  Go Back
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}