'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

type Profile = 'Student' | 'Adult' | 'Parent' | 'Custom';

interface HeaderProps {
  activeProfile: Profile;
  setActiveProfile: (profile: Profile) => void;
}

export default function Header({ activeProfile, setActiveProfile }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-40 w-full bg-white dark:bg-zinc-900 border-b-2 border-zinc-200 dark:border-zinc-800 transition-all duration-300 ${
        isScrolled ? 'py-2 shadow-md' : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          {/* Added bg-white so the black penguin logo pops in dark mode */}
          <div className={`relative rounded-xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-700 bg-white transition-all duration-300 ${
            isScrolled ? 'w-8 h-8' : 'w-10 h-10'
          }`}>
             <Image 
               src="/nootnoot.png" 
               alt="Daydream Logo" 
               fill 
               className="object-contain p-0.5"
               priority
             />
          </div>
          <span className={`font-extrabold tracking-tight transition-all duration-300 ${
            isScrolled ? 'text-xl' : 'text-2xl'
          }`}>
            <span className="text-orange-500">D</span>
            <span className="text-teal-600 dark:text-teal-400">aydream</span>
            <span className="text-teal-600 dark:text-teal-400">.</span>
          </span>
        </div>

        {/* Center: Desktop Profile Navigation Options */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:block">
          <ul className={`flex flex-row items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl transition-all duration-300 ${
            isScrolled ? 'p-1' : 'p-1.5'
          }`}>
            {(['Student', 'Adult', 'Parent', 'Custom'] as Profile[]).map((profile) => (
              <li 
                key={profile}
                onClick={() => setActiveProfile(profile)}
                className={`cursor-pointer rounded-xl transition-all font-bold ${
                  isScrolled ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
                } ${
                  activeProfile === profile 
                    ? 'bg-teal-500 text-white shadow-sm scale-95' 
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                I'm a {profile}
              </li>
            ))}
          </ul>
        </nav>

        {/* Far Right: Link to WaddlePH */}
        <div className="flex items-center gap-3">
          <a 
            href="https://waddleph.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`font-extrabold text-teal-600 dark:text-teal-400 border-2 border-teal-500 rounded-xl hover:bg-teal-500 hover:text-white transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
              isScrolled ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'
            }`}
          >
            Visit WaddlePH!
          </a>
        </div>

      </div>

      {/* Mobile Profile Navigation Options */}
      <div className="md:hidden flex justify-center mt-3 px-4">
        <ul className="flex flex-row flex-wrap justify-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl w-full">
          {(['Student', 'Adult', 'Parent', 'Custom'] as Profile[]).map((profile) => (
            <li 
              key={profile}
              onClick={() => setActiveProfile(profile)}
              className={`cursor-pointer px-3 py-1 rounded-lg transition-all font-bold text-xs ${
                activeProfile === profile 
                  ? 'bg-teal-500 text-white shadow-sm' 
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {profile}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}