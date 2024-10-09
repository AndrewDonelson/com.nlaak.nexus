import React from 'react';
import { StoryNode } from '@/lib/game/types';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StoryNodeListProps {
  nodes: StoryNode[];
  onNodeSelect: (nodeId: Id<"storyNodes">) => void;
  onNodeCreate: () => void;
  onNodeDelete: (nodeId: Id<"storyNodes">) => void;
}

const StoryNodeList: React.FC<StoryNodeListProps> = ({ nodes, onNodeSelect, onNodeCreate, onNodeDelete }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Story Nodes</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {nodes.map((node) => (
            <li key={node._id} className="flex justify-between items-center">
              <Button
                variant="ghost"
                className="text-left truncate"
                onClick={() => onNodeSelect(node._id)}
              >
                {node.content.substring(0, 30)}...
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
        <Button
          variant="outline"
          onClick={onNodeCreate}
          className="mt-4 w-full"
        >
          Create New Node
        </Button>
      </CardContent>
    </Card>
  );
};

export default StoryNodeList;