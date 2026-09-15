'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X, ExternalLink } from 'lucide-react';

type Profile = 'Student' | 'Adult' | 'Parent' | 'Custom';

interface HeaderProps {
  activeProfile: Profile;
  setActiveProfile: (profile: Profile) => void;
}

export default function Header({ activeProfile, setActiveProfile }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const profiles: Profile[] = ['Student', 'Adult', 'Parent', 'Custom'];

  return (
    <header 
      className={`sticky top-0 z-50 w-full bg-white dark:bg-zinc-900 border-b-2 border-zinc-200 dark:border-zinc-800 transition-all duration-300 ${
        isScrolled ? 'py-2 shadow-md' : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative">
        
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

        {/* Center: Desktop Profile Navigation Options */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:block">
          <ul className={`flex flex-row items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl transition-all duration-300 ${
            isScrolled ? 'p-1' : 'p-1.5'
          }`}>
            {profiles.map((profile) => (
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

        {/* Far Right: Desktop WaddlePH Link & Mobile Hamburger Toggle */}
        <div className="flex items-center gap-3">
          {/* Desktop Only WaddlePH Button */}
          <a 
            href="https://waddleph.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`hidden md:inline-block font-extrabold text-teal-600 dark:text-teal-400 border-2 border-teal-500 rounded-xl hover:bg-teal-500 hover:text-white transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
              isScrolled ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'
            }`}
          >
            Visit WaddlePH!
          </a>

          {/* Clean Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-teal-500 text-white flex items-center justify-center shadow-sm active:scale-95 transition-all"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-zinc-900 border-b-2 border-zinc-200 dark:border-zinc-800 shadow-xl py-6 px-6 animate-fadeIn space-y-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Select Profile</p>
              {/* Subtle active profile tag inside the open drawer */}
              <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-lg border border-teal-200 dark:border-teal-900">
                Active: {activeProfile}
              </span>
            </div>
            
            <ul className="flex flex-col gap-2">
              {profiles.map((profile) => (
                <li 
                  key={profile}
                  onClick={() => {
                    setActiveProfile(profile);
                    setMobileMenuOpen(false);
                  }}
                  className={`cursor-pointer px-4 py-3 rounded-2xl transition-all font-bold text-sm flex items-center justify-between ${
                    activeProfile === profile 
                      ? 'bg-teal-500 text-white shadow-md' 
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <span>I'm a {profile}</span>
                  {activeProfile === profile && <span className="w-2 h-2 rounded-full bg-white"></span>}
                </li>
              ))}
            </ul>
          </div>

          {/* WaddlePH Link */}
          <div className="pt-4 border-t-2 border-zinc-100 dark:border-zinc-800">
            <a 
              href="https://waddleph.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 font-extrabold text-teal-600 dark:text-teal-400 border-2 border-teal-500 rounded-2xl hover:bg-teal-500 hover:text-white transition-all text-sm shadow-sm"
            >
              Visit WaddlePH! <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}