import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { StoryNode } from '@/lib/game/types';

interface MapComponentProps {
  size: number;
  nodes: StoryNode[];
  onNodeClick: (nodeId: string) => void;
  isGenerating: boolean;
  generationProgress: number;
}

const terrainColors: Record<string, string> = {
  plains: 'bg-green-300',
  forest: 'bg-green-600',
  mountains: 'bg-gray-500',
  desert: 'bg-yellow-300',
  snow: 'bg-white',
  water: 'bg-blue-400',
  // Add more terrain types and colors as needed
};

const MapComponent: React.FC<MapComponentProps> = ({ size, nodes, onNodeClick, isGenerating, generationProgress }) => {
  const [hoveredNode, setHoveredNode] = useState<StoryNode | null>(null);

  const cellSize = 16; // px
  const mapSizePx = size * cellSize;

  return (
    <ScrollArea className="h-[400px] w-full border rounded">
      <div 
        style={{ width: `${mapSizePx}px`, height: `${mapSizePx}px` }}
        className="relative bg-background"
      >
        {nodes.map((node, index) => {
          const x = node.x * cellSize;
          const y = node.y * cellSize;
          const terrainClass = terrainColors[node.terrain] || 'bg-gray-300';
          return (
            <TooltipProvider key={node._id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`absolute ${terrainClass} hover:opacity-80 cursor-pointer transition-colors duration-200 ease-in-out animate-in fade-in-50`}
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
                <TooltipContent className="bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95">
                  <p className="text-sm">{node.content.substring(0, 50)}...</p>
                  <p className="text-xs text-muted-foreground">Terrain: {node.terrain}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
        {isGenerating && (
          <div 
            className="absolute bg-primary opacity-30"
            style={{
              left: 0,
              top: 0,
              width: `${(generationProgress / (size * size)) * 100}%`,
              height: '100%',
              transition: 'width 0.5s ease-in-out',
            }}
          />
        )}
      </div>
    </ScrollArea>
  );
};

export default MapComponent;