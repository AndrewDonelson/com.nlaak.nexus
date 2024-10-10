import React from 'react';
import { Id } from '@/convex/_generated/dataModel';
import { ScrollArea } from "@/components/ui/scroll-area"

interface ConvexStoryNode {
  _id: Id<"storyNodes">;
  content: string;
  choices: {
    id: string;
    text: string;
    nextNodeId?: Id<"storyNodes"> | null;
    consequences: Array<{
      type: string;
      target: string;
      value?: number;
      description?: string;
    }>;
  }[];
}

interface MapComponentProps {
  nodes: ConvexStoryNode[];
  currentNodeId: Id<"storyNodes"> | null;
  onNodeClick: (nodeId: Id<"storyNodes">) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ nodes, currentNodeId, onNodeClick }) => {
  const nodeMap = new Map(nodes.map(node => [node._id, node]));

  const renderNode = (nodeId: Id<"storyNodes">, depth: number = 0, visited: Set<Id<"storyNodes">> = new Set()) => {
    if (depth > 5 || visited.has(nodeId)) return null; // Limit depth and prevent cycles
    visited.add(nodeId);

    const node = nodeMap.get(nodeId);
    if (!node) return null;

    const isCurrentNode = node._id === currentNodeId;
    const hasChildren = node.choices.some(choice => choice.nextNodeId);

    return (
      <div key={node._id} style={{ marginLeft: `${depth * 20}px` }}>
        <div
          className={`p-2 mb-2 rounded cursor-pointer ${
            isCurrentNode ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary-foreground'
          }`}
          onClick={() => onNodeClick(node._id)}
        >
          {node.content.substring(0, 30)}...
        </div>
        {hasChildren && (
          <div>
            {node.choices.map(choice => 
              choice.nextNodeId && renderNode(choice.nextNodeId, depth + 1, new Set(visited))
            )}
          </div>
        )}
      </div>
    );
  };

  const renderTree = () => {
    try {
      if (nodes.length === 0) return <div>No nodes available</div>;
      return renderNode(nodes[0]._id);
    } catch (error) {
      console.error("Error rendering node tree:", error);
      return <div>Error rendering map</div>;
    }
  };

  return (
    <ScrollArea className="h-[300px] w-[200px]">
      {renderTree()}
    </ScrollArea>
  );
};

export default MapComponent;