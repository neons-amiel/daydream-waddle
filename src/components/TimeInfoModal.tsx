'use client'
import React from 'react';
import { X, Clock } from 'lucide-react';

interface TimeInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TimeInfoModal({ isOpen, onClose }: TimeInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-6 md:p-8 rounded-[2rem] shadow-2xl max-w-sm w-full relative transition-colors duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl  text-teal-600 dark:text-teal-400">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">Time to Afford</h3>
        </div>

        {/* Human Copy */}
        <p className="text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed text-sm md:text-base">
            If your salary and expenses stay the same, this number shows <span className="font-bold text-teal-600 dark:text-teal-400">how long it will take to have enough</span> to purchase your item.
        </p>

        {/* Action Button */}
        <button 
          onClick={onClose}
          className="mt-8 w-full py-3.5 bg-teal-500 hover:bg-teal-600 text-white font-extrabold rounded-2xl shadow-lg transition-all"
        >
          Got it
        </button>
      </div>
    </div>
  );
}