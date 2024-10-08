/**
 * @file FeatureSection.tsx
 * @description This component renders a grid of feature cards using a comprehensive
 * lookup table for optimal layout based on screen width and number of features.
 */

"use client"
import React, { useState, useEffect } from 'react';
import { FeatureCard, FeatureCardProps } from "./FeatureCard";

interface FeatureSectionProps {
  features: FeatureCardProps[];
  title: string;
}

interface LayoutConfig {
  rows: number;
  cols: number[];
}

const layoutLookup: { [key: string]: { [key: number]: LayoutConfig } } = {
  small: {
    // width < 768px
    1: { rows: 1, cols: [1] },
    2: { rows: 1, cols: [2] },
    3: { rows: 2, cols: [1, 2] },
    4: { rows: 2, cols: [2, 2] },
    5: { rows: 3, cols: [1, 2, 2] },
    6: { rows: 3, cols: [2, 2, 2] },
    7: { rows: 4, cols: [1, 2, 2, 2] },
    8: { rows: 4, cols: [2, 2, 2, 2] },
    9: { rows: 5, cols: [1, 2, 2, 2, 2] },
    10: { rows: 5, cols: [2, 2, 2, 2, 2] },
    11: { rows: 6, cols: [1, 2, 2, 2, 2, 2] },
    12: { rows: 6, cols: [2, 2, 2, 2, 2, 2] },
    13: { rows: 7, cols: [1, 2, 2, 2, 2, 2, 2] },
    14: { rows: 7, cols: [2, 2, 2, 2, 2, 2, 2] },
    15: { rows: 8, cols: [1, 2, 2, 2, 2, 2, 2, 2] },
    16: { rows: 8, cols: [2, 2, 2, 2, 2, 2, 2, 2] },
    17: { rows: 9, cols: [1, 2, 2, 2, 2, 2, 2, 2, 2] },
    18: { rows: 9, cols: [2, 2, 2, 2, 2, 2, 2, 2, 2] },
    19: { rows: 10, cols: [1, 2, 2, 2, 2, 2, 2, 2, 2, 2] },
    20: { rows: 10, cols: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2] },
    21: { rows: 11, cols: [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2] }
  },
  medium: {
    // 768px <= width < 1024px
    1: { rows: 1, cols: [1] },
    2: { rows: 1, cols: [2] },
    3: { rows: 1, cols: [3] },
    4: { rows: 2, cols: [2, 2] },
    5: { rows: 2, cols: [2, 3] },
    6: { rows: 2, cols: [3, 3] },
    7: { rows: 3, cols: [1, 3, 3] },
    8: { rows: 3, cols: [2, 3, 3] },
    9: { rows: 3, cols: [3, 3, 3] },
    10: { rows: 4, cols: [1, 3, 3, 3] },
    11: { rows: 4, cols: [2, 3, 3, 3] },
    12: { rows: 4, cols: [3, 3, 3, 3] },
    13: { rows: 5, cols: [1, 3, 3, 3, 3] },
    14: { rows: 5, cols: [2, 3, 3, 3, 3] },
    15: { rows: 5, cols: [3, 3, 3, 3, 3] },
    16: { rows: 6, cols: [1, 3, 3, 3, 3, 3] },
    17: { rows: 6, cols: [2, 3, 3, 3, 3, 3] },
    18: { rows: 6, cols: [3, 3, 3, 3, 3, 3] },
    19: { rows: 7, cols: [1, 3, 3, 3, 3, 3, 3] },
    20: { rows: 7, cols: [2, 3, 3, 3, 3, 3, 3] },
    21: { rows: 7, cols: [3, 3, 3, 3, 3, 3, 3] }
  },
  large: {
    // width >= 1024px
    1: { rows: 1, cols: [1] },
    2: { rows: 1, cols: [2] },
    3: { rows: 1, cols: [3] },
    4: { rows: 1, cols: [4] },
    5: { rows: 2, cols: [2, 3] },
    6: { rows: 2, cols: [3, 3] },
    7: { rows: 2, cols: [3, 4] },
    8: { rows: 2, cols: [4, 4] },
    9: { rows: 3, cols: [3, 3, 3] },
    10: { rows: 3, cols: [3, 3, 4] },
    11: { rows: 3, cols: [3, 4, 4] },
    12: { rows: 3, cols: [4, 4, 4] },
    13: { rows: 4, cols: [3, 3, 3, 4] },
    14: { rows: 4, cols: [3, 3, 4, 4] },
    15: { rows: 4, cols: [3, 4, 4, 4] },
    16: { rows: 4, cols: [4, 4, 4, 4] },
    17: { rows: 5, cols: [3, 3, 3, 4, 4] },
    18: { rows: 5, cols: [3, 3, 4, 4, 4] },
    19: { rows: 5, cols: [3, 4, 4, 4, 4] },
    20: { rows: 5, cols: [4, 4, 4, 4, 4] },
    21: { rows: 6, cols: [3, 3, 3, 4, 4, 4] }
  }
};

export const FeatureSection: React.FC<FeatureSectionProps> = ({ features, title }) => {
  const [layout, setLayout] = useState<LayoutConfig>({ rows: 1, cols: [1] });

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      const count = features.length;
      
      let sizeCategory: string;
      let newLayout: LayoutConfig;
  
      if (width < 768) {
        sizeCategory = 'mobile';
        newLayout = {
          rows: count,
          cols: Array(count).fill(1)
        };
      } else if (width < 1024) {
        sizeCategory = 'small';
        newLayout = layoutLookup[sizeCategory][Math.min(count, 21)] || { rows: Math.ceil(count / 2), cols: Array(Math.ceil(count / 2)).fill(2) };
      } else if (width < 1280) {
        sizeCategory = 'medium';
        newLayout = layoutLookup[sizeCategory][Math.min(count, 21)] || { rows: Math.ceil(count / 3), cols: Array(Math.ceil(count / 3)).fill(3) };
      } else {
        sizeCategory = 'large';
        newLayout = layoutLookup[sizeCategory][Math.min(count, 21)] || { rows: Math.ceil(count / 4), cols: Array(Math.ceil(count / 4)).fill(4) };
      }
  
      setLayout(newLayout);
  
      console.log(`Size: ${sizeCategory}, Features: ${count}, Rows: ${newLayout.rows}, Cols: ${newLayout.cols.join('/')}`);
    };
  
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [features.length]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background text-foreground">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in-down">{title}</h2>
        <div className="grid gap-8">
          {layout.cols.map((colCount, rowIndex) => (
            <div key={rowIndex} className={`grid grid-cols-${colCount} gap-8`} style={{gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`}}>
              {features.slice(layout.cols.slice(0, rowIndex).reduce((a, b) => a + b, 0), 
                              layout.cols.slice(0, rowIndex + 1).reduce((a, b) => a + b, 0))
                      .map((feature, colIndex) => (
                <div key={colIndex} className="animate-fade-in-up w-full" style={{ animationDelay: `${(rowIndex * 4 + colIndex) * 0.1}s` }}>
                  <FeatureCard {...feature} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;