'use client'
import React from 'react';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12 border-t-2 border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-300">
      
      {/* Left: Copyright & Date */}
      <div className="flex flex-col items-center md:items-start gap-1">
        <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400">
          © {currentYear} Daydream. All rights reserved.
        </p>
        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          Built and Powered by <span className="text-teal-600 dark:text-teal-400">WaddlePH</span>
        </p>
      </div>

      {/* Right: Waddle Brand Banner Image Slot */}
      <div className="flex items-center">
        <a 
          href="" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block hover:opacity-95 transition-opacity"
        >
          <div className="relative h-9 w-36 sm:w-44">
            <Image 
              src="/waddle_banner.svg" 
              alt="WaddlePH Logo Banner" 
              fill 
              className="object-contain"
            />
          </div>
        </a>
      </div>

    </footer>
  );
}