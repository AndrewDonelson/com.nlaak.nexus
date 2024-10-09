import React from 'react';
import { StoryNode } from '@/lib/game/types';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StoryNodeListProps {
  nodes: StoryNode[];
  onNodeSelect: (nodeId: Id<"storyNodes">) => void;
  onNodeDelete: (nodeId: Id<"storyNodes">) => void;
}

const StoryNodeList: React.FC<StoryNodeListProps> = ({ nodes, onNodeSelect, onNodeDelete }) => {
  return (
    <div className="bg-card text-card-foreground shadow-md rounded px-4 py-3">
      <h2 className="text-xl font-bold mb-4">Story Nodes</h2>
      <ScrollArea className="h-[400px] pr-4">
        <ul className="space-y-2">
          {nodes.map((node) => (
            <li key={node._id} className="flex justify-between items-center p-2 bg-background rounded hover:bg-accent transition-colors">
              <Button
                variant="ghost"
                className="text-left truncate flex-grow mr-2"
                onClick={() => onNodeSelect(node._id)}
              >
                {node.content ? node.content.substring(0, 30) + '...' : 'No content'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onNodeDelete(node._id)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default StoryNodeList;