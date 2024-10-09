import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MapSizeSelectorProps {
  onSizeChange: (size: number) => void;
}

const MapSizeSelector: React.FC<MapSizeSelectorProps> = ({ onSizeChange }) => {
  const sizes = Array.from({ length: 46 }, (_, i) => (i + 5) * 2);

  return (
    <div className="mb-4">
      <label htmlFor="mapSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Map Size
      </label>
      <Select onValueChange={(value) => onSizeChange(Number(value))}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select map size" />
        </SelectTrigger>
        <SelectContent>
          {sizes.map(size => (
            <SelectItem key={size} value={size.toString()}>
              {size}x{size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MapSizeSelector;