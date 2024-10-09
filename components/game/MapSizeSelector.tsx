import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MapSizeSelectorProps {
  onSizeChange: (size: number) => void;
}

const MapSizeSelector: React.FC<MapSizeSelectorProps> = ({ onSizeChange }) => {
  const sizes = Array.from({ length: 46 }, (_, i) => (i + 5) * 2);

  return (
    <div className="mb-4 animate-fade-in">
      <label htmlFor="mapSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Map Size
      </label>
      <Select onValueChange={(value) => onSizeChange(Number(value))}>
        <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <SelectValue placeholder="Select map size" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600">
          {sizes.map(size => (
            <SelectItem 
              key={size} 
              value={size.toString()}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {size}x{size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MapSizeSelector;