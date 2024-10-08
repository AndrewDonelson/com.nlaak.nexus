import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  title?: string;
  subtitle?: string;
  link?: string;
}

export interface GalleryFilterableProps {
  items: GalleryItem[];
  categories: string[];
}

const GalleryFilterable: React.FC<GalleryFilterableProps> = ({ items, categories }) => {
  const [filter, setFilter] = useState('All');
  const router = useRouter();

  const filteredItems = filter === 'All' ? items : items.filter(item => item.category === filter);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4 bg-card text-card-foreground p-2 rounded-lg">
        <button
          onClick={() => setFilter('All')}
          className={cn(
            "px-3 py-1 rounded-md transition-colors",
            filter === 'All' ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
          )}
        >
          All
        </button>
        <div className="flex space-x-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={cn(
                "px-3 py-1 rounded-md transition-colors",
                filter === category ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <div key={item.id} className="relative aspect-square overflow-hidden rounded-lg group">
            <Image
              src={item.src}
              alt={item.alt}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-110"
            />
            {(item.title || item.subtitle) && (
              <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 text-white p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                {item.title && <h3 className="text-lg font-semibold">{item.title}</h3>}
                {item.subtitle && <p className="text-sm">{item.subtitle}</p>}
              </div>
            )}
            {item.link && (
              <Link href={item.link} passHref>
                <span className="absolute inset-0 cursor-pointer" onClick={(e) => {
                  e.preventDefault();
                  router.push(item.link!);
                }} />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryFilterable;