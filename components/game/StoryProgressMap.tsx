import React, { useMemo } from 'react';
import { Id } from '@/convex/_generated/dataModel';
import { StoryNode } from '@/lib/game/types';

interface StoryProgressMapProps {
  nodes: StoryNode[];
  currentNodeId: Id<"storyNodes"> | null;
  visitedNodes: Id<"storyNodes">[];
}

interface TreeNode extends Omit<StoryNode, 'parentNodeId'> {
  children: TreeNode[];
}

const StoryProgressMap: React.FC<StoryProgressMapProps> = ({ nodes, currentNodeId, visitedNodes }) => {
  const treeData = useMemo(() => buildTree(nodes), [nodes]);

  const nodeRadius = 5;
  const horizontalSpacing = 50;
  const verticalSpacing = 30;

  function buildTree(nodes: StoryNode[]): TreeNode {
    const nodeMap = new Map<Id<"storyNodes">, TreeNode>();
    
    nodes.forEach(node => {
      nodeMap.set(node._id, { ...node, children: [] });
    });

    let root: TreeNode | undefined;

    nodes.forEach(node => {
      const treeNode = nodeMap.get(node._id);
      if (treeNode) {
        if (node.parentNodeId === null || node.parentNodeId === undefined) {
          root = treeNode;
        } else {
          const parent = nodeMap.get(node.parentNodeId);
          if (parent) {
            parent.children.push(treeNode);
          }
        }
      }
    });

    return root || { _id: '' as Id<"storyNodes">, content: '', choices: [], visitCount: 0, children: [] };
  }

  function renderTree(node: TreeNode, x: number, y: number, level: number): JSX.Element[] {
    const elements: JSX.Element[] = [];

    // Render current node
    const isCurrentNode = node._id === currentNodeId;
    const isVisited = visitedNodes.includes(node._id);
    const fill = isCurrentNode ? '#4CAF50' : (isVisited ? '#2196F3' : '#9E9E9E');

    elements.push(
      <circle
        key={`node-${node._id}`}
        cx={x}
        cy={y}
        r={nodeRadius}
        fill={fill}
      />
    );

    // Render children and connections
    const childrenCount = node.children.length;
    const startY = y - ((childrenCount - 1) * verticalSpacing) / 2;

    node.children.forEach((child, index) => {
      const childX = x + horizontalSpacing;
      const childY = startY + index * verticalSpacing;

      elements.push(
        <line
          key={`line-${node._id}-${child._id}`}
          x1={x + nodeRadius}
          y1={y}
          x2={childX - nodeRadius}
          y2={childY}
          stroke="#9E9E9E"
          strokeWidth="1"
        />
      );

      elements.push(...renderTree(child, childX, childY, level + 1));
    });

    return elements;
  }

  const svgElements = renderTree(treeData, nodeRadius * 2, 150, 0);
  const svgWidth = nodes.length * horizontalSpacing;
  const svgHeight = 300;

  return (
    <div className="story-progress-map">
      <svg width={svgWidth} height={svgHeight}>
        {svgElements}
      </svg>
    </div>
  );
};

export default StoryProgressMap;