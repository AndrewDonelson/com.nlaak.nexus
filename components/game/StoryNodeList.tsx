import React from 'react';
import { StoryNode } from '@/lib/game/types';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Defines the props for the `StoryNodeList` component, which renders a list of story nodes.
 *
 * @param nodes - An array of `StoryNode` objects representing the story nodes to be displayed.
 * @param onNodeSelect - A function that is called when a story node is selected, with the ID of the selected node as an argument.
 * @param onNodeCreate - A function that is called when the "Create New Node" button is clicked.
 * @param onNodeDelete - A function that is called when the "Delete" button for a story node is clicked, with the ID of the node to be deleted as an argument.
 */
interface StoryNodeListProps {
  nodes: StoryNode[];
  onNodeSelect: (nodeId: Id<"storyNodes">) => void;
  onNodeCreate: () => void;
  onNodeDelete: (nodeId: Id<"storyNodes">) => void;
}

/**
 * Renders a list of story nodes, allowing the user to select, create, and delete nodes.
 *
 * @param nodes - An array of `StoryNode` objects representing the story nodes to be displayed.
 * @param onNodeSelect - A function that is called when a story node is selected, with the ID of the selected node as an argument.
 * @param onNodeCreate - A function that is called when the "Create New Node" button is clicked.
 * @param onNodeDelete - A function that is called when the "Delete" button for a story node is clicked, with the ID of the node to be deleted as an argument.
 */
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