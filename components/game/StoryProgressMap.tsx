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
  parent: TreeNode | null;
  isVisited: boolean;
  isCurrent: boolean;
  level: number;
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
      parent: null,
      isVisited: visitedNodes.includes(node._id),
      isCurrent: node._id === currentNodeId,
      level: 0
    }));
  
    nodes.forEach(node => {
      node.choices.forEach(choice => {
        if (choice.nextNodeId) {
          const parent = nodeMap.get(node._id);
          const child = nodeMap.get(choice.nextNodeId);
          if (parent && child) {
            parent.children.push(child);
            child.parent = parent;
          }
        }
      });
    });
  
    const rootNode = nodes.find(node => !node.parentNodeId);
    return rootNode ? nodeMap.get(rootNode._id)! : { id: 'root' as Id<"storyNodes">, children: [], parent: null, isVisited: false, isCurrent: false, level: 0 };
  };

  const setLevels = (node: TreeNode, level: number) => {
    node.level = level;
    node.children.forEach(child => setLevels(child, level + 1));
  };

  const renderTree = (node: TreeNode, x: number, y: number): JSX.Element => {
    const nodeRadius = 10;
    const horizontalSpacing = 80;
    const verticalSpacing = 60;

    const color = node.isCurrent ? 'fill-primary' : node.isVisited ? 'fill-secondary' : 'fill-muted';

    return (
      <g key={node.id}>
        <circle
          cx={x}
          cy={y}
          r={nodeRadius}
          className={`${color} transition-colors duration-200`}
        />
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
                strokeWidth="2"
              />
              {renderTree(child, childX, childY)}
            </React.Fragment>
          );
        })}
      </g>
    );
  };

  const findCurrentNode = (node: TreeNode): TreeNode | null => {
    if (node.isCurrent) return node;
    for (const child of node.children) {
      const found = findCurrentNode(child);
      if (found) return found;
    }
    return null;
  };

  const getVisibleNodes = (currentNode: TreeNode): TreeNode => {
    let visibleRoot = currentNode;
    for (let i = 0; i < 2; i++) {
      if (visibleRoot.parent) visibleRoot = visibleRoot.parent;
      else break;
    }

    const pruneDeepNodes = (node: TreeNode, maxDepth: number): TreeNode => {
      if (node.level - visibleRoot.level > maxDepth) {
        return { ...node, children: [] };
      }
      return {
        ...node,
        children: node.children.map(child => pruneDeepNodes(child, maxDepth))
      };
    };

    return pruneDeepNodes(visibleRoot, 4); // 2 levels before + current + 2 levels after
  };

  useEffect(() => {
    debug('StoryProgressMap', `Received currentNodeId: ${currentNodeId}`);
    debug('StoryProgressMap', `Received visitedNodes: ${visitedNodes.join(', ')}`);
    debug('StoryProgressMap', `Total nodes: ${nodes.length}`);
    
    if (svgRef.current && nodes.length > 0) {
      const fullTree = buildTree(nodes);
      setLevels(fullTree, 0);
      const currentNode = findCurrentNode(fullTree);
      if (currentNode) {
        const visibleTree = getVisibleNodes(currentNode);
        debug('StoryProgressMap', `Built visible tree structure`);
        const svgContent = renderTree(visibleTree, 50, 150);
        const svgElement = svgRef.current;
        
        if (!rootRef.current) {
          rootRef.current = createRoot(svgElement);
        }
        
        rootRef.current.render(svgContent);
      }
    }
  }, [nodes, currentNodeId, visitedNodes]);

  return (
    <Card className="w-full h-full animate-in fade-in duration-300">
      <CardHeader>
        <CardTitle>Story Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 600 300" />
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