// app/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import SoftwareStack from "./components/SoftwareStack";
import Image from "next/image";

interface StackItem {
  name: string;
  displayName: string;
  icon: string | null;
  description?: string;
  color: string;
}

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 5000): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(url, {
    ...options,
    signal: controller.signal
  });

  clearTimeout(id);
  return response;
};

export default function Home() {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [stackItems, setStackItems] = useState<StackItem[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<StackItem | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [backgroundColor, setBackgroundColor] = useState("from-purple-500 to-pink-500");
  const disclaimerText = "Disclaimer: Any usage of the template of this website is prohibited and all rights are reserved to Insidertech ID Technology 2024. If you have any inquiries, please contact one of the authors.";
  const marqueeRef = useRef<HTMLDivElement>(null);
  
  
  useEffect(() => {
    const fullText = "Present to You By Insidertech ID";
    let index = 0;

    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.substring(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
        setInterval(() => setShowCursor(prev => !prev), 500);
      }
    }, 100); // Faster typing animation

    return () => clearInterval(typingInterval);
  }, []);

  
  useEffect(() => {
    const marquee = marqueeRef.current;
    if (marquee) {
      const textWidth = marquee.scrollWidth;
      const containerWidth = marquee.offsetWidth;

      const scrollSpeed = 50; // Adjust for desired speed
      let position = 0;

      const animateMarquee = () => {
        position -= 1;
        if (position < -textWidth) {
          position = containerWidth;
        }
        marquee.style.transform = `translateX(${position}px)`;
        requestAnimationFrame(animateMarquee);
      };
      requestAnimationFrame(animateMarquee);
    }
  }, []);
  
  useEffect(() => {
    const fetchStackData = async () => {
      const stackItemsToFetch: StackItem[] = [
        { name: 'nextdotjs', displayName: 'Next.js', color: 'from-blue-500 to-blue-700', icon: null },
        { name: 'vercel', displayName: 'Vercel', color: 'from-gray-700 to-gray-900', icon: null },
        { name: 'typescript', displayName: 'TypeScript', color: 'from-blue-400 to-blue-600', icon: null },
        { name: 'tailwindcss', displayName: 'Tailwind CSS', color: 'from-sky-400 to-sky-600', icon: null },
        { name: 'linux', displayName: 'Linux', color: 'from-yellow-400 to-yellow-600', icon: null },
        { name: 'docker', displayName: 'Docker', color: 'from-blue-800 to-blue-900', icon: null },
        { name: 'cloudflare', displayName: 'Cloudflare', color: 'from-orange-500 to-orange-700', icon: null },
        { name: 'postgresql', displayName: 'PostgreSQL', color: 'from-blue-600 to-blue-800', icon: null },
        { name: 'directus', displayName: 'Directus', color: 'from-green-500 to-green-700', icon: null },
        { name: 'github', displayName: 'GitHub', color: 'from-gray-800 to-gray-900', icon: null },
        { name: 'redis', displayName: 'Redis', color: 'from-red-500 to-red-700', icon: null },
        { name: 'googlegemini', displayName: 'Google Gemini', color: 'from-blue-500 to-blue-700', icon: null }, // You can replace 'google' with the actual name in Simple Icons
        { name: 'google', displayName: 'Google Gemma', color: 'from-red-400 to-red-600', icon: null }, // You can replace 'google' with the actual name in Simple Icons
        { name: 'mikrotik', displayName: 'Mikrotik', color: 'from-red-400 to-red-600', icon: null },
    ];

    try {
      const fetchedItems = await Promise.all(
        stackItemsToFetch.map(async (item) => {
          const response = await fetchWithTimeout(`https://simpleicons.org/icons/${item.name.toLowerCase()}.svg`, {
            // Explicitly set the signal property to undefined.
            signal: undefined, 
          });
          const svgString = await response.text();
          return { ...item, icon: svgString };
        })
      );
      setStackItems(fetchedItems);
    } catch (err) {
      console.error("Error fetching icons:", err);
      // Set a fallback state or display an error message to the user
    } finally {
      setIsLoading(false); // Mark loading as finished, even if there's an error
    }
  };

  fetchStackData();
}, []);

  const handleIconClick = (item: StackItem) => {
    setSelectedIcon(selectedIcon === item ? null : item);
    setBackgroundColor(selectedIcon === item ? "from-purple-500 to-pink-500" : item.color); // Set or reset background
  };

  return (
    <div className="flex flex-col min-h-screen"> {/* Enclose everything in a flex container */}
    <main className={`flex-grow mt-8 text-center min-h-screen text-shadow-default bg-gradient-to-br bg-fixed animate-gradient ${backgroundColor} font-[Poppins]`}>

      {/* Main Heading */}
      <section>
        <h1 className="text-4xl font-bold text-white mb-4 text-shadow-default">
          Wedding Invitation Software Stack
        </h1>
        <h2 className="text-xl text-white mb-8 text-shadow-default">
          {displayedText}
          {showCursor && <span className="animate-blink text-white text-shadow-default">_</span>}
        </h2>
      </section>

      {/* Software Stack */}
      <section className="py-8">
        <SoftwareStack 
          handleIconClick={handleIconClick} 
          stackItems={stackItems} 
          isLoading={isLoading} 
          backgroundColor={backgroundColor}
        />
      </section>

      {/* New AI Section */}
      <section className="mt-12 text-white">
        <h2 className="text-3xl font-bold mb-4 text-shadow-default">Empowering with AI</h2>
        <p className="text-lg mb-8 text-shadow-default"> {/* Apply text shadow to paragraph */}
          Leveraging the power of Google&apos;s advanced language models to create intelligent and personalized user experiences.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Two columns on medium and larger screens */}
          {/* Google Gemini Advanced Card */}
          <div className="bg-white/10 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-2 text-shadow-default text-white-500">Google Gemini Advanced</h3>
            <ul className="list-disc pl-5">
              <li>Multimodal understanding (text, images, code)</li>
              <li>Exceptional text generation and summarization</li>
              <li>Advanced reasoning and problem-solving capabilities</li>
              <li>Enhanced creative generation</li>
              <li>Fine-grained control and customization</li>
            </ul>
          </div>

          {/* Google Gemma LLM Card */}
          <div className="bg-white/10 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-2 text-shadow-default text-white-500">Google Gemma LLM</h3>
            <ul className="list-disc pl-5">
              <li>Lightweight and efficient language model</li>
              <li>Versatile language model for various natural language processing tasks</li>
              <li>Ideal for applications with resource constraints</li>
              <li>Easy to deploy and integrate</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Created By Section */}
      <section className="mt-16 text-center">
      <div className="p-8 bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg shadow-lg mx-4 md:mx-8 lg:mx-16"> 
          <p className="text-lg mb-4 text-white font-semibold">Created with ❤️ by:</p>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8"> 
            <div className="flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-110"> {/* Added hover effect */}
                <span className="text-xl text-white font-semibold mb-2">Danish Abyan Pratista</span>
                <div className="flex space-x-2">
                  <a href="https://github.com/abyancore" target="_blank" rel="noopener noreferrer">
                    <Image src="https://simpleicons.org/icons/github.svg" alt="GitHub" width={24} height={24} />
                  </a>
                  <a href="https://www.linkedin.com/in/danish-abyan-pratista-8b370b29b" target="_blank" rel="noopener noreferrer">
                    <Image src="https://simpleicons.org/icons/linkedin.svg" alt="LinkedIn" width={24} height={24} />
                  </a>
                </div>
              </div>

            <div className="flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-110"> {/* Added hover effect */}
              <span className="text-xl text-white font-semibold mb-2">Muhammad Rizki Perdana Putra</span>
              <div className="flex space-x-2">
                <a href="https://github.com/insiderhack" target="_blank" rel="noopener noreferrer">
                  <Image src="https://simpleicons.org/icons/github.svg" alt="GitHub" width={24} height={24} />
                </a>
                <a href="https://www.linkedin.com/in/muhrizki16" target="_blank" rel="noopener noreferrer">
                  <Image src="https://simpleicons.org/icons/linkedin.svg" alt="LinkedIn" width={24} height={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer Section */}
      <footer className="mt-16 text-center fixed inset-x-0 bottom-0">
        <div className="mt-8 p-4 bg-gray-900/80 border-t-2 border-purple-500 rounded-t-lg overflow-x-hidden">
          <div className="marquee-container whitespace-nowrap" ref={marqueeRef}>
            <p className="text-xs text-white inline-block">{disclaimerText}</p> 
          </div>
        </div>
      </footer>
    </main>
    </div>
  );
}
