import React, { useState } from 'react';
import { LogoProps } from '@/props';
import BigCard from './shared/BigCard';

const Logo: React.FC<LogoProps> = ({ className = '' }) => {

  return (
    <div className={`${className} flex flex-col items-center`}>
      <img 
        src="/images/ns-logo.png" 
        alt="Nlaak Studios" 
        className="w-full max-w-xs md:max-w-md mb-4 md:mb-8 animate-fade-in-down duration-700 delay-300" 
      />
      <BigCard 
        title="Crafting the Future of Software"
        description="Our goal is to bring the latest technologies used by tech giants such as Google, Facebook, Twitter, and Uber, just to name a few, to small businesses that cannot afford the high cost of a full leading edge development team - at a fraction of the cost. We handle everything for you from app design & development to deployment on decentralized Blockchain."
        className="max-w-4xl mx-auto"
      />
    </div>
  );
}

export default Logo;