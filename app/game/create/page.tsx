"use client"
import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import StoryNodeEditor from '@/components/game/StoryNodeEditor';
import StoryNodeList from '@/components/game/StoryNodeList';
import MapSizeSelector from '@/components/game/MapSizeSelector';
import MapComponent from '@/components/game/MapComponent';
import GameInfoSetter from '@/components/game/GameInfoSetter';
//import WorldGenerator from '@/components/game/WorldGenerator';
import { StoryNode } from '@/lib/game/types';
import { Button } from '@/components/ui/button';
import WorldGeneratorDebug from '@/components/game/WorldGeneratorDebug';

const GameCreatePage: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<Id<"storyNodes"> | null>(null);
  const [mapSize, setMapSize] = useState<number>(10);
  const [gameInfo, setGameInfo] = useState({ genre: '', theme: '', additionalInfo: '' });
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  
  const storyNodes = useQuery(api.nexusEngine.getAllStoryNodes) as StoryNode[] | undefined;
  const updateStoryNode = useMutation(api.nexusEngine.updateStoryNode);
  const deleteStoryNode = useMutation(api.nexusEngine.deleteStoryNode);

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId as Id<"storyNodes">);
  };

  const handleNodeUpdate = async (updatedNode: StoryNode) => {
    if (selectedNodeId) {
      await updateStoryNode({
        nodeId: selectedNodeId,
        updates: {
          content: updatedNode.content,
          choices: updatedNode.choices,
          terrain: updatedNode.terrain,
          x: updatedNode.x,
          y: updatedNode.y
        }
      });
    }
  };

  const handleNodeDelete = async (nodeId: Id<"storyNodes">) => {
    await deleteStoryNode({ nodeId });
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  };

  return (
    <div className="container mx-auto p-4 mt-12">
      <h1 className="text-3xl font-bold mb-6 text-primary">Game Creator</h1>
      
      <GameInfoSetter onInfoSet={setGameInfo} />
      
      <div className="mt-4">
        <MapSizeSelector onSizeChange={setMapSize} />
      </div>
      
      <div className="mt-4">
        {/* <WorldGenerator
          gameInfo={gameInfo}
          mapSize={mapSize}
          onProgress={setGenerationProgress}
        /> */}

        <WorldGeneratorDebug
        gameInfo={{
            genre: "Sci-Fi",
            theme: "Elan Mosk, a brilliant wants to build a space company to colonize mars",
            additionalInfo: "The story starts with Elan sitting in from of a PC programming in the year 1999"
        }}
        onProgress={(progress) => console.log(`Generation progress: ${progress}%`)}
        />        
      </div>
      
      {generationProgress > 0 && generationProgress < 100 && (
        <div className="mt-4">
          <progress value={generationProgress} max={100} className="w-full" />
          <p>{Math.round(generationProgress)}% complete</p>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        <div className="w-full lg:w-1/2">
          <MapComponent 
            size={mapSize}
            nodes={storyNodes || []}
            onNodeClick={handleNodeSelect}
            isGenerating={generationProgress > 0 && generationProgress < 100}
            generationProgress={generationProgress}
          />
        </div>
        <div className="w-full lg:w-1/2">
          <StoryNodeList
            nodes={storyNodes || []}
            onNodeSelect={handleNodeSelect}
            onNodeDelete={handleNodeDelete}
          />
        </div>
      </div>
      
      <div className="mt-6">
        {selectedNodeId && storyNodes && (
          <StoryNodeEditor
            node={storyNodes.find(node => node._id === selectedNodeId) || null}
            onNodeUpdate={handleNodeUpdate}
          />
        )}
      </div>
    </div>
  );
};
export default GameCreatePage;