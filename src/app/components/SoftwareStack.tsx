'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image'; // If you're using Next.js Image

interface StackItem {
  name: string; 
  displayName: string; 
  icon: string | null;
  description?: string;
  color: string; 
}
interface SoftwareStackProps {
  handleIconClick: (item: StackItem) => void;
  stackItems: StackItem[];
  isLoading: boolean;
  backgroundColor: string;
}
const SoftwareStack: React.FC<SoftwareStackProps> = ({
  handleIconClick,
  stackItems,
  isLoading,
  backgroundColor
}) => {
  const [selectedIcon, setSelectedIcon] = useState<StackItem | null>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (iconRef.current && !iconRef.current.contains(event.target as Node)) {
        setSelectedIcon(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" ref={iconRef}>
      {isLoading ? (
        <p>Loading icons...</p>
      ) : (
        stackItems.map((item) => (
          <div
            key={item.name}
            className={`
              relative group // Added for group-hover effect
              rounded-lg p-4 shadow-md transition-transform duration-300 ease-in-out 
              ${selectedIcon?.name === item.name ? "scale-150" : ""}
            `}
            onClick={() => handleIconClick(item)}
          > 
            <div className="flex items-center mb-2 cursor-pointer relative">
              {/* Blurred Background */}
              <div className="absolute inset-0 bg-fixed animate-gradient rounded-full backdrop-filter backdrop-blur-xl group-hover:backdrop-blur-2xl" /> 

              {/* Icon Content */}
              <div
                dangerouslySetInnerHTML={{ __html: item.icon || "" }}
                className="w-8 h-8 rounded-full bg-gradient-to-br relative z-10 group-hover:bg-opacity-50"
              />

              <h3 className="ml-2 text-lg font-semibold z-10">{item.displayName}</h3>
            </div>
            {item.description && (
              <p className="text-gray-600 z-10">{item.description}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default SoftwareStack;
