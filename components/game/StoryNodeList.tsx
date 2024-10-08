import React from 'react';
import { StoryNode } from '@/lib/game/types';
import { Id } from '@/convex/_generated/dataModel';

interface StoryNodeListProps {
  nodes: StoryNode[];
  onNodeSelect: (nodeId: Id<"storyNodes">) => void;
  onNodeCreate: () => void;
  onNodeDelete: (nodeId: Id<"storyNodes">) => void;
}

const StoryNodeList: React.FC<StoryNodeListProps> = ({ nodes, onNodeSelect, onNodeCreate, onNodeDelete }) => {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-bold mb-4">Story Nodes</h2>
      <ul className="mb-4">
        {nodes.map((node) => (
          <li key={node._id} className="mb-2 flex justify-between items-center">
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => onNodeSelect(node._id)}
            >
              {node.content.substring(0, 30)}...
            </button>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => onNodeDelete(node._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={onNodeCreate}
      >
        Create New Node
      </button>
    </div>
  );
};

export default StoryNodeList;