"use client"
import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import StoryNodeEditor from '@/components/game/StoryNodeEditor';
import StoryNodeList from '@/components/game/StoryNodeList';
import GameInfoSetter from '@/components/game/GameInfoSetter';
import { StoryNode, StorySize } from '@/lib/game/types';
import { Button } from '@/components/ui/button';
import WorldGeneratorDebug from '@/components/game/WorldGeneratorDebug';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GameCreatePage: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<Id<"storyNodes"> | null>(null);
  const [storySize, setStorySize] = useState<StorySize>(StorySize.Normal);
  const [gameInfo, setGameInfo] = useState({ genre: '', theme: '', additionalInfo: '' });
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  
  const storyNodes = useQuery(api.nexusEngine.getAllStoryNodes) as StoryNode[] | undefined;
  const updateStoryNode = useMutation(api.nexusEngine.updateStoryNode);
  const deleteStoryNode = useMutation(api.nexusEngine.deleteStoryNode);

  const handleNodeSelect = (nodeId: Id<"storyNodes">) => {
    setSelectedNodeId(nodeId);
  };

  const handleNodeUpdate = async (updatedNode: StoryNode) => {
    if (selectedNodeId) {
      await updateStoryNode({
        nodeId: selectedNodeId,
        updates: {
          content: updatedNode.content,
          choices: updatedNode.choices,
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
      
      {/* <div className="mt-4">
        <Select onValueChange={(value) => setStorySize(StorySize[value as keyof typeof StorySize])}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select story size" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(StorySize).filter(key => isNaN(Number(key))).map((size) => (
              <SelectItem key={size} value={size}>{size} ({StorySize[size as keyof typeof StorySize]} nodes)</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}
      
      <div className="mt-4">
        <WorldGeneratorDebug
          gameInfo={gameInfo}
          onProgress={setGenerationProgress}
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
          <StoryNodeList
            nodes={storyNodes || []}
            onNodeSelect={handleNodeSelect}
            onNodeDelete={handleNodeDelete}
          />
        </div>
        <div className="w-full lg:w-1/2">
          {selectedNodeId && storyNodes && (
            <StoryNodeEditor
              node={storyNodes.find(node => node._id === selectedNodeId) || null}
              onNodeUpdate={handleNodeUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCreatePage;