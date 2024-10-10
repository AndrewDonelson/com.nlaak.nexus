import React from 'react';
import { Id } from '@/convex/_generated/dataModel';
import { ScrollArea } from "@/components/ui/scroll-area"
import { StoryNode } from '@/lib/game/types';

interface MapComponentProps {
  nodes: StoryNode[];
  currentNodeId: Id<"storyNodes"> | null;
  visitedNodes: Id<"storyNodes">[];
  onNodeClick: (nodeId: Id<"storyNodes">) => void;
}

interface TreeNode extends StoryNode {
  children: TreeNode[];
}

const MapComponent: React.FC<MapComponentProps> = ({ nodes, currentNodeId, visitedNodes, onNodeClick }) => {
  const buildTree = (nodes: StoryNode[]): TreeNode => {
    const nodeMap = new Map<Id<"storyNodes">, TreeNode>();
    nodes.forEach(node => nodeMap.set(node._id, { ...node, children: [] }));

    let root: TreeNode | undefined;

    nodes.forEach(node => {
      const treeNode = nodeMap.get(node._id);
      if (treeNode) {
        if (node.parentNodeId === null) {
          root = treeNode;
        } else {
          const parent = nodeMap.get(node.parentNodeId);
          if (parent) {
            parent.children.push(treeNode);
          }
        }
      }
    });

    return root || { _id: '' as Id<"storyNodes">, content: '', choices: [], parentNodeId: null, visitCount: 0, children: [] };
  };

  const renderNode = (node: TreeNode, depth: number = 0): JSX.Element => {
    const isCurrentNode = node._id === currentNodeId;
    const isVisited = visitedNodes.includes(node._id);

    return (
      <div key={node._id} style={{ marginLeft: `${depth * 20}px` }}>
        <div
          className={`p-2 mb-2 rounded cursor-pointer ${
            isCurrentNode ? 'bg-primary text-primary-foreground' :
            isVisited ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
          } hover:opacity-80`}
          onClick={() => onNodeClick(node._id)}
        >
          {node.content.substring(0, 30)}...
        </div>
        {node.children.map(child => renderNode(child, depth + 1))}
      </div>
    );
  };

  const treeRoot = buildTree(nodes);

  return (
    <ScrollArea className="h-[400px] w-[300px] border rounded">
      <div className="p-4">
        {renderNode(treeRoot)}
      </div>
    </ScrollArea>
  );
};

export default MapComponent;