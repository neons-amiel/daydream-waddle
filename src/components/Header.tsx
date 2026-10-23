'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

export default function Header() {
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
      className={`sticky top-0 z-50 w-full bg-white dark:bg-zinc-900 border-b-2 border-zinc-200 dark:border-zinc-800 transition-all duration-300 ${
        isScrolled ? 'py-2 shadow-md' : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
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

        {/* Right: WaddlePH link (shown on every screen size now that there's no menu) */}
        <a
          href="https://waddleph.com"
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 font-extrabold text-teal-600 dark:text-teal-400 border-2 border-teal-500 rounded-xl hover:bg-teal-500 hover:text-white transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
            isScrolled ? 'px-3 py-1 text-xs' : 'px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm'
          }`}
        >
          Visit WaddlePH!
          <ExternalLink className="w-3.5 h-3.5 md:hidden" />
        </a>

      </div>
    </header>
  );
}