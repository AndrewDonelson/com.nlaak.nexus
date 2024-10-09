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
import { StoryNode } from '@/lib/game/types';

const GameCreatePage: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<Id<"storyNodes"> | null>(null);
  const [mapSize, setMapSize] = useState<number>(10);
  const [gameInfo, setGameInfo] = useState({ genre: '', theme: '', additionalInfo: '' });
  
  const storyNodes = useQuery(api.nexusEngine.getAllStoryNodes) as StoryNode[] | undefined;
  const createStoryNode = useMutation(api.nexusEngine.createStoryNode);
  const updateStoryNode = useMutation(api.nexusEngine.updateStoryNode);
  const deleteStoryNode = useMutation(api.nexusEngine.deleteStoryNode);

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId as Id<"storyNodes">);
  };

  const handleNodeCreate = async () => {
    const newNodeId = await createStoryNode({
      content: "New node content",
      choices: []
    });
    setSelectedNodeId(newNodeId);
  };

  const handleNodeUpdate = async (updatedNode: StoryNode) => {
    if (selectedNodeId) {
      await updateStoryNode({
        nodeId: selectedNodeId,
        updates: {
          content: updatedNode.content,
          choices: updatedNode.choices
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
      
      <MapSizeSelector onSizeChange={setMapSize} />
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <MapComponent 
            size={mapSize}
            nodes={storyNodes || []}
            onNodeClick={handleNodeSelect}
          />
        </div>
        <div className="w-full md:w-1/2">
          <StoryNodeList
            nodes={storyNodes || []}
            onNodeSelect={handleNodeSelect}
            onNodeCreate={handleNodeCreate}
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