import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StoryNode } from '@/lib/game/types';
import { Id } from '@/convex/_generated/dataModel';
import { debug } from '@/lib/utils';
import { createRoot } from 'react-dom/client';

interface StoryProgressMapProps {
  nodes: StoryNode[];
  currentNodeId: Id<"storyNodes">;
  visitedNodes: Id<"storyNodes">[];
  totalNodes: number;
}

interface TreeNode {
  id: Id<"storyNodes">;
  children: TreeNode[];
  content: string;
  isVisited: boolean;
  isCurrent: boolean;
}

const StoryProgressMap: React.FC<StoryProgressMapProps> = ({ nodes, currentNodeId, visitedNodes, totalNodes }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [progress, setProgress] = useState(0);
  const rootRef = useRef<ReturnType<typeof createRoot> | null>(null);

  useEffect(() => {
    setProgress((visitedNodes.length / totalNodes) * 100);
  }, [visitedNodes, totalNodes]);

  const buildTree = (nodes: StoryNode[]): TreeNode => {
    const nodeMap = new Map<Id<"storyNodes">, TreeNode>();
    nodes.forEach(node => nodeMap.set(node._id, {
      id: node._id,
      children: [],
      content: node.content,
      isVisited: visitedNodes.includes(node._id),
      isCurrent: node._id === currentNodeId
    }));
  
    nodes.forEach(node => {
      node.choices.forEach(choice => {
        if (choice.nextNodeId) {
          const parent = nodeMap.get(node._id);
          const child = nodeMap.get(choice.nextNodeId);
          if (parent && child) {
            parent.children.push(child);
          }
        }
      });
    });
  
    const rootNode = nodes.find(node => !node.parentNodeId);
    return rootNode ? nodeMap.get(rootNode._id)! : { id: 'root' as Id<"storyNodes">, children: [], content: '', isVisited: false, isCurrent: false };
  };

  const renderTree = (node: TreeNode, x: number, y: number, level: number): JSX.Element => {
    const nodeRadius = 5;
    const horizontalSpacing = 50;
    const verticalSpacing = 30;

    const color = node.isCurrent ? 'fill-primary' : node.isVisited ? 'fill-secondary' : 'fill-muted';

    return (
      <g key={node.id}>
        <circle
          cx={x}
          cy={y}
          r={nodeRadius}
          className={`${color} transition-colors duration-200`}
        />
        <text
          x={x}
          y={y + nodeRadius * 2}
          textAnchor="middle"
          className="text-xs fill-current"
        >
          {node.content.substring(0, 10)}...
        </text>
        {node.children.map((child, index) => {
          const childX = x + horizontalSpacing;
          const childY = y + (index - (node.children.length - 1) / 2) * verticalSpacing;
          return (
            <React.Fragment key={child.id}>
              <line
                x1={x}
                y1={y}
                x2={childX}
                y2={childY}
                stroke="currentColor"
                strokeOpacity="0.3"
              />
              {renderTree(child, childX, childY, level + 1)}
            </React.Fragment>
          );
        })}
      </g>
    );
  };

  useEffect(() => {
    debug('StoryProgressMap', `Received currentNodeId: ${currentNodeId}`);
    debug('StoryProgressMap', `Received visitedNodes: ${visitedNodes.join(', ')}`);
    debug('StoryProgressMap', `Total nodes: ${nodes.length}`);
    debug('StoryProgressMap', `Nodes: ${JSON.stringify(nodes, null, 2)}`);
    
    if (svgRef.current && nodes.length > 0) {
      const tree = buildTree(nodes);
      debug('StoryProgressMap', `Built tree: ${JSON.stringify(tree, null, 2)}`);
      const svgContent = renderTree(tree, 20, 100, 0);
      const svgElement = svgRef.current;
      
      if (!rootRef.current) {
        rootRef.current = createRoot(svgElement);
      }
      
      rootRef.current.render(svgContent);
    }
  }, [nodes, currentNodeId, visitedNodes]);

  return (
    <Card className="w-full h-full animate-in fade-in duration-300">
      <CardHeader>
        <CardTitle>Story Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <svg ref={svgRef} width="100%" height="100%" />
        </ScrollArea>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center mt-2 text-sm">Progress: {Math.round(progress)}%</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoryProgressMap;