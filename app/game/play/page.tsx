"use client"
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { debug } from '@/lib/utils';
import StoryProgressMap from '@/components/game/StoryProgressMap';
import StoryInfo from '@/components/game/StoryInfo';
import StoryScene from '@/components/game/StoryScene';
import StorySceneChoices from '@/components/game/StorySceneChoices';

const GamePlayPage: React.FC = () => {
  const [sessionId, setSessionId] = useState<Id<"nexusGameSessions"> | null>(null);
  const [playerId, setPlayerId] = useState<Id<"players"> | null>(null);

  const session = useQuery(api.nexusEngine.getNexusGameSession, sessionId ? { sessionId } : "skip");
  const player = useQuery(api.nexusEngine.getPlayer, playerId ? { playerId } : "skip");
  const currentNode = useQuery(api.nexusEngine.getStoryNode, session?.currentNodeId ? { nodeId: session.currentNodeId } : "skip");
  const allNodes = useQuery(api.nexusEngine.getAllStoryNodes);

  const createPlayer = useMutation(api.nexusEngine.createPlayer);
  const createSession = useMutation(api.nexusEngine.createNexusGameSession);
  const makeChoice = useMutation(api.nexusEngine.makeChoice);
  const goBack = useMutation(api.nexusEngine.goBack);

  useEffect(() => {
    const initializeGame = async () => {
      if (!playerId) {
        const newPlayerId = await createPlayer({ name: "Test Player", description: "A test player" });
        setPlayerId(newPlayerId);
        debug('GamePlayPage', `Created new player with ID: ${newPlayerId}`);
      }

      if (playerId && !sessionId && allNodes && allNodes.length > 0) {
        const newSessionId = await createSession({
          playerId,
          startingNodeId: allNodes[0]._id,
          title: "Test Game Session"
        });
        setSessionId(newSessionId);
        debug('GamePlayPage', `Created new session with ID: ${newSessionId}`);
      }
    };

    initializeGame();
  }, [playerId, sessionId, allNodes, createPlayer, createSession]);

  const handleChoiceSelected = async (choiceId: string) => {
    if (sessionId) {
      await makeChoice({ sessionId, choiceId });
      debug('GamePlayPage', `Choice made: ${choiceId}`);
    }
  };

  const handleGoBack = async () => {
    if (sessionId) {
      await goBack({ sessionId });
      debug('GamePlayPage', `Went back to previous node`);
    }
  };

  useEffect(() => {
    if (currentNode) {
      debug('GamePlayPage', `Current node: ${JSON.stringify(currentNode, null, 2)}`);
    }
    if (allNodes) {
      debug('GamePlayPage', `All nodes: ${JSON.stringify(allNodes, null, 2)}`);
    }
  }, [currentNode, allNodes]);

  if (!session || !currentNode || !allNodes || !player) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 mt-12 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <StoryInfo 
          title={session.title} 
          playerName={player.name} 
          alignment={player.politicalAlignment.overallAlignment}      
        />
        <StoryProgressMap
          nodes={allNodes}
          currentNodeId={session.currentNodeId}
          visitedNodes={session.visitedNodes}
          totalNodes={allNodes.length}
        />
      </div>

      <StoryScene content={currentNode.content} />

      <StorySceneChoices 
        choices={currentNode.choices || []}
        onChoiceSelect={handleChoiceSelected}
        onGoBack={handleGoBack}
        canGoBack={session.visitedNodes.length > 1}
      />
    </div>
  );
};

export default GamePlayPage;