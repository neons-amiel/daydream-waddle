'use client'
import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface SavingsInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SavingsInfoModal({ isOpen, onClose }: SavingsInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-6 md:p-8 rounded-[2rem] shadow-2xl max-w-md w-full relative transition-colors duration-300">
        
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
          <div className="p-2.5 rounded-2xl text-teal-600 dark:text-teal-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">Why Mandatory Savings?</h3>
        </div>

        {/* Polished, Human Copy with Teal Highlight */}
        <p className="text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed text-sm md:text-base">
          Financial experts recommend putting <span className="font-bold text-teal-600 dark:text-teal-400">30% of your earnings straight into savings</span> the moment you get paid. <br /> Always secure your safety net first! 
          Your goals can always wait a little bit more <span className="font-mono inline-block">:D</span>
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