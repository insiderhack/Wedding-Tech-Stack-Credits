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
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const imageRef = useRef<HTMLImageElement>(null); // Reference to the Image component
  
  
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

   // Audio/Image Rotation Effect (Refactored and Simplified)
   useEffect(() => {
    const audio = audioRef.current;
    const image = imageRef.current;

    if (audio && image) {
      const handlePlayPause = () => { // Combined into one handler
        setIsPlaying(!isPlaying);
        image.style.animation = isPlaying ? 'none' : 'spin 3s linear infinite'; // Toggle animation
      };

      audio.addEventListener('play', handlePlayPause);
      audio.addEventListener('pause', handlePlayPause);

      return () => {
        audio.removeEventListener('play', handlePlayPause);
        audio.removeEventListener('pause', handlePlayPause);
      };
    }
  }, [isPlaying]); // Dependency added to re-trigger the effect when isPlaying changes
  
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
          if (response.ok) { // Check if the request was successful
            const svgString = await response.text();
            return { ...item, icon: svgString };
          } else {
            // Handle errors, e.g., log to the console or set a default icon
            console.error(`Failed to load icon for ${item.name}: ${response.status}`);
            return item; // Return the item without an icon
          }        
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

useEffect(() => {
  const audio = audioRef.current;
  if (audio) {
    // Set up event listener for 'canplaythrough'
    audio.addEventListener('canplaythrough', () => {
      // Ensure the audio is fully loaded before setting isPlaying to false
      setIsPlaying(false);
    });
  }

  return () => {
    if (audio) {
      // Clean up event listener on component unmount
      audio.removeEventListener('canplaythrough', () => {
        setIsPlaying(false);
      });
    }
  };
}, []);

const togglePlay = () => {
  const audio = audioRef.current;
  if (audio) {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }
};

// const togglePlay = () => {
//   if (audioRef.current) {
//     if (isPlaying) {
//       audioRef.current.pause();
//     } else {
//       audioRef.current.play();
//     }
//     setIsPlaying(!isPlaying); // Update state after play/pause
//   }
// };


  const handleIconClick = (item: StackItem) => {
    setSelectedIcon(selectedIcon === item ? null : item);
    setBackgroundColor(selectedIcon === item ? "from-purple-500 to-pink-500" : item.color); // Set or reset background
  };

  return (
    <div className="flex flex-col min-h-screen relative"> {/* Added relative positioning to the container */}
      <head>
        <style jsx global>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </head>
      <main className={`flex-grow mt-0 text-center min-h-screen text-shadow-default bg-gradient-to-br bg-fixed animate-gradient ${backgroundColor} font-[Poppins]`}> 
        
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
      <section className="mt-12 text-white">
          <h2 className="text-3xl font-bold mb-4 text-shadow-default">Our Software Stack</h2>
          <p className="text-lg mb-8 text-shadow-default">
            Explore the cutting-edge technologies powering our wedding invitation platform. Click on the icons below to learn more.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {stackItems.map((item) => (
              <div
                key={item.name}
                className={`cursor-pointer p-4 rounded-lg shadow-md transition-transform duration-300 ease-in-out transform hover:scale-110 ${selectedIcon === item ? 'bg-white' : 'bg-white/10'
                  }`}
                onClick={() => handleIconClick(item)}
                title={item.displayName}
              >
                {item.icon && (
                  <Image
                    src={`data:image/svg+xml;utf8,${encodeURIComponent(item.icon)}`}
                    alt={item.displayName}
                    className="h-16 mx-auto"
                    width={64}
                    height={64}
                  />
                )}
                <p className="mt-2 text-sm text-center text-shadow-default">{item.displayName}</p>
              </div>
            ))}
          </div>
          {selectedIcon && (
            <div className="mt-4 p-4 bg-white/10 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-2 text-white-500 text-shadow-default">{selectedIcon.displayName}</h3>
              <p className="text-shadow-default">{selectedIcon.description}</p>
            </div>
          )}
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
      
      {/* Music Player Section */}
      <section className="mt-16 text-white relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-pink-900 opacity-50 rounded-lg"></div>
        <div className="relative z-10 p-8 rounded-lg flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-4 text-shadow-default">
            Rizki & Dita Heart's at One
          </h2>
          <div 
            className={`w-64 h-64 rounded-full bg-cover bg-center shadow-lg mb-4 cursor-pointer transition-transform duration-300 ${isPlaying ? 'scale-110' : ''}`}
            style={{ backgroundImage: "url('/hearts-at-one.jpeg')" }} 
            onClick={togglePlay}
          >
            {/* Play/Pause Icon (You can use an SVG or image here) */}
            {!isPlaying && (
              <svg className="w-20 h-20 text-white mx-auto mt-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            )}
            {isPlaying && (
              <svg className="w-20 h-20 text-white mx-auto mt-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            )}
          </div>
          <audio ref={audioRef} src="https://rizkidita-wedding.online/backsound.opus" />
        </div>
      </section>

      {/* Suno AI Section - Updated Style */}
      <section className="mt-16 text-white relative"> 
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-pink-900 opacity-50 rounded-lg"></div>
          <div className="relative z-10 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-4 text-shadow-default">
              Suno AI: Elevate Your Wedding with Music
            </h2>
            <p className="text-lg mb-8 text-shadow-default">
              Create an unforgettable atmosphere with AI-generated music tailored to your special day.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/20 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-shadow-default text-purple-300">
                  Personalized Soundtracks
                </h3>
                <p className="text-sm text-shadow-default">
                  Experience the magic of music designed to match your unique wedding theme and preferences.
                </p>
              </div>
              <div className="bg-white/20 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-shadow-default text-pink-300">
                  Seamless Integration
                </h3>
                <p className="text-sm text-shadow-default">
                  Easily add beautiful background music to your wedding website and let Suno AI handle the rest.
                </p>
              </div>
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
      </main>

      {/* Spacer for the footer */}
      <div className="h-[56px]"></div> {/* Adjust the height to match your footer */}

      {/* Footer Section */}
      <footer className="mt-16 text-center fixed bottom-0 inset-x-0"> 
        <div className="mt-8 p-4 bg-gray-900/80 border-t-2 border-purple-500 rounded-t-lg overflow-x-hidden">
          <div className="marquee-container whitespace-nowrap" ref={marqueeRef}>
            <p className="text-xs text-white inline-block">{disclaimerText}</p> 
          </div>
        </div>
      </footer>
    </div>
  );
}