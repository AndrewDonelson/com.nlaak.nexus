import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { StoryNode } from '@/lib/game/types';

interface MapComponentProps {
  size: number;
  nodes: StoryNode[];
  onNodeClick: (nodeId: string) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ size, nodes, onNodeClick }) => {
  const [hoveredNode, setHoveredNode] = useState<StoryNode | null>(null);

  const cellSize = 16; // px
  const mapSizePx = size * cellSize;

  return (
    <ScrollArea className="h-[400px] w-full border rounded">
      <div 
        style={{ width: `${mapSizePx}px`, height: `${mapSizePx}px` }}
        className="relative bg-gray-100 dark:bg-gray-800"
      >
        {nodes.map((node, index) => {
          const x = (index % size) * cellSize;
          const y = Math.floor(index / size) * cellSize;
          return (
            <TooltipProvider key={node._id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="absolute bg-blue-500 hover:bg-blue-600 cursor-pointer"
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                    }}
                    onClick={() => onNodeClick(node._id)}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{node.content.substring(0, 50)}...</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default MapComponent;