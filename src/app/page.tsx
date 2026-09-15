'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Sun, Moon, HelpCircle, Info } from 'lucide-react';
import Header from '../components/Header';
import StudentCalculator from '../components/StudentCalculator';
import AdultCalculator from '../components/AdultCalculator';
import HowItWorksModal from '../components/HowItWorksModal';
import TimeInfoModal from '../components/TimeInfoModal';
import Footer from '../components/Footer';

type Profile = 'Student' | 'Adult' | 'Parent' | 'Custom';

export default function DaydreamHome() {
  const [activeProfile, setActiveProfile] = useState<Profile>('Adult');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showTimeInfo, setShowTimeInfo] = useState(false); // Time to afford info modal state

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Dream Item State
  const [dreamItem, setDreamItem] = useState('');
  const [dreamCost, setDreamCost] = useState<string>(''); 

  // --- LIVE STATE FOR CALCULATIONS ---
  const [totalIncome, setTotalIncome] = useState(0); 
  const [totalExpenses, setTotalExpenses] = useState(0);
  
  const parseNum = (val: any) => Number(String(val).replace(/,/g, '')) || 0;
  
  const leftover = totalIncome - totalExpenses;
  const numericCost = parseNum(dreamCost);
  
  const totalMonths = numericCost && leftover > 0 ? numericCost / leftover : 0;
  const yearsToAfford = (totalMonths / 12).toFixed(1);

  const handleFinancialUpdate = useCallback((income: number, expenses: number) => {
    setTotalIncome(income);
    setTotalExpenses(expenses);
  }, []);

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    if (rawValue === '') {
      setDreamCost('');
    } else {
      setDreamCost(Number(rawValue).toLocaleString('en-US'));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F9FA] dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 transition-colors duration-300 relative">
      
      {/* 1. COMPACT ISOLATED HEADER */}
      <Header activeProfile={activeProfile} setActiveProfile={setActiveProfile} />

      {/* MAIN CONTENT - BENTO GRID */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* SUBTLE TRIGGER RIGHT ABOVE DREAM ITEM BENTO */}
          <div className="col-span-1 lg:col-span-12 flex justify-start">
            <button
              onClick={() => setShowHowItWorks(true)}
              className="inline-flex items-center gap-1.5 text-s font-bold text-zinc-500 hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 px-3.5 py-1.5 rounded-xl shadow-sm transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-teal-500" /> 
              How it works
            </button>
          </div>

          {/* 2. BENTO BOX: DREAM ITEM ROW */}
          <section className="col-span-1 lg:col-span-12 bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-[2rem] shadow-sm border-2 border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row gap-6 items-center transition-colors duration-300">
            
            <div className="flex-1 w-full space-y-1">
              <label className="block text-sm font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">Your Dream Item</label>
              <input 
                type="text" 
                placeholder="e.g., Japan Trip, PS5..." 
                className="w-full text-2xl md:text-3xl font-bold bg-transparent border-b-2 border-zinc-300 dark:border-zinc-700 focus:border-teal-500 pb-2 outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-colors"
                value={dreamItem}
                onChange={(e) => setDreamItem(e.target.value)}
              />
            </div>

            <div className="flex-1 w-full space-y-1">
              <label className="block text-sm font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">Total Cost</label>
              <div className="flex items-end gap-2 border-b-2 border-zinc-300 dark:border-zinc-700 focus-within:border-teal-500 transition-colors pb-2">
                <span className="text-2xl md:text-3xl font-bold text-zinc-500 dark:text-zinc-400">₱</span>
                <input 
                  type="text" 
                  inputMode="numeric"
                  placeholder="0" 
                  className="w-full text-2xl md:text-3xl font-bold bg-transparent outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                  value={dreamCost}
                  onChange={handleCostChange}
                />
              </div>
            </div>
            
            {/* Quick Result Bento Tile with Info Button */}
            <div className="w-full md:w-auto bg-teal-500 dark:bg-teal-600 text-white p-6 rounded-3xl flex flex-col justify-center items-center md:items-start min-w-[200px] shadow-lg transition-colors duration-300 relative">
              <div className="flex items-center justify-between w-full gap-2">
                <span className="text-sm font-bold uppercase tracking-widest opacity-90">Time to Afford</span>
                <button 
                  onClick={() => setShowTimeInfo(true)}
                  className="p-1 rounded-full hover:bg-teal-600 dark:hover:bg-teal-700 text-teal-100 hover:text-white transition-colors"
                  aria-label="More information about Time to Afford"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl md:text-5xl font-black">
                  {numericCost && leftover > 0 
                    ? (totalMonths < 12 ? totalMonths.toFixed(1) : yearsToAfford) 
                    : '---'}
                </span>
                <span className="font-bold text-teal-100">
                  {numericCost && leftover > 0 
                    ? (totalMonths < 12 ? 'mos' : 'yrs') 
                    : ''}
                </span>
              </div>
            </div>

          </section>

          {/* 3. BENTO BOX: CALCULATOR INPUTS */}
          <section className="col-span-1 lg:col-span-8 bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-[2rem] shadow-sm border-2 border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-8 bg-teal-500 rounded-full"></div>
              <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                Your Profile
              </h2>
            </div>
            
            <div className="mt-4">
              {activeProfile === 'Student' && <StudentCalculator onUpdate={handleFinancialUpdate} />}
              {activeProfile === 'Adult' && <AdultCalculator onUpdate={handleFinancialUpdate} />}
              {activeProfile === 'Parent' && <div className="p-12 text-center font-bold text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 rounded-[2rem] border-2 border-dashed border-zinc-300 dark:border-zinc-700">Parent calculator coming next!</div>}
              {activeProfile === 'Custom' && <div className="p-12 text-center font-bold text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 rounded-[2rem] border-2 border-dashed border-zinc-300 dark:border-zinc-700">Custom calculator coming next!</div>}
            </div>
          </section>

          {/* 4. RIGHT COLUMN BENTO BOXES */}
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
            
            {/* BENTO: Financial Summary */}
            <section className="bg-teal-500 dark:bg-teal-700 text-white p-8 rounded-[2rem] shadow-xl transition-colors duration-300">
              <h3 className="text-sm font-bold text-teal-100 uppercase tracking-widest mb-6">Monthly Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-teal-600 dark:bg-teal-800 p-4 rounded-2xl">
                  <span className="font-bold text-teal-50">Total Income</span>
                  <span className="font-black text-white text-xl">+{totalIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center bg-teal-600 dark:bg-teal-800 p-4 rounded-2xl">
                  <span className="font-bold text-teal-50">Total Expenses</span>
                  <span className="font-black text-teal-200 text-xl">-{totalExpenses.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t-2 border-teal-400 dark:border-teal-600 flex justify-between items-end">
                <span className="font-bold text-teal-100">What's Left</span>
                <span className="text-4xl font-black text-white">₱{leftover.toLocaleString()}</span>
              </div>
            </section>

            {/* BENTO: AI Insights */}
            <section className="bg-teal-50 dark:bg-teal-950/20 p-8 rounded-[2rem] border-2 border-teal-200 dark:border-teal-900/50 relative overflow-hidden flex-1 flex flex-col justify-center transition-colors duration-300">
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <div className="bg-teal-200 dark:bg-teal-800 p-2 rounded-xl transition-colors duration-300">
                  <svg className="w-5 h-5 text-teal-800 dark:text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="font-extrabold text-teal-900 dark:text-teal-400">A.I. Insights</h3>
              </div>
              <p className="text-teal-900 dark:text-teal-300 font-medium leading-relaxed relative z-10">
                "If you cut down on outside food by 15%, you'll have enough for your <span className="font-bold">{dreamItem || 'dream item'}</span> a whole month earlier!"
              </p>
              <div className="absolute inset-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center z-20 transition-colors duration-300">
                <span className="bg-teal-600 text-white text-sm font-extrabold uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg transform -rotate-2">
                  Coming in Phase 2
                </span>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* RENDER MODALS */}
      <HowItWorksModal isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
      <TimeInfoModal isOpen={showTimeInfo} onClose={() => setShowTimeInfo(false)} />

      {/* FLOATING PERPETUAL THEME TOGGLE BUTTON */}
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-2xl border-2 border-zinc-700 dark:border-zinc-300 hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
        aria-label="Toggle Dark Mode"
      >
        {isDarkMode ? <Sun className="w-6 h-6 text-orange-400" /> : <Moon className="w-6 h-6 text-teal-400" />}
      </button>

      <Footer/>

    </div>
    
  );
}