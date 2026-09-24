'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sun, Moon, HelpCircle, Info, Download, Loader2 } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
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
  const [showTimeInfo, setShowTimeInfo] = useState(false);


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
  const [totalSavings, setTotalSavings] = useState(0); 

  // --- INDIVIDUAL EXPENSES INSIDE CATEGORIES --- 
  const [expenseBreakdown, setExpenseBreakdown] = useState<Record<string, string>>({});

  // --- EXPORT STATE & REF ---
  const summaryRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const parseNum = (val: any) => Number(String(val).replace(/,/g, '')) || 0;
  
  const leftover = totalIncome - totalExpenses - totalSavings;
  const numericCost = parseNum(dreamCost);
  
  const totalMonths = numericCost && leftover > 0 ? numericCost / leftover : 0;
  const yearsToAfford = (totalMonths / 12).toFixed(1);

  const expensePercentage = totalIncome > 0 ? Math.min(((totalExpenses + totalSavings) / totalIncome) * 100, 100) : 0;
  const isOverBudget = (totalExpenses + totalSavings) > totalIncome;

  // AI insights
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleFinancialUpdate = useCallback((income: number, expenses: number, savings: number, details?: Record<string, string>) => {
    setTotalIncome(income);
    setTotalExpenses(expenses);
    setTotalSavings(savings);
    if (details) {
      setExpenseBreakdown(details);
    }
  }, []);

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    if (rawValue === '') {
      setDreamCost('');
    } else {
      setDreamCost(Number(rawValue).toLocaleString('en-US'));
    }
  };

  const timeDisplay = numericCost && leftover > 0
    ? { value: totalMonths < 12 ? totalMonths.toFixed(1) : yearsToAfford, unit: totalMonths < 12 ? 'mos' : 'yrs' }
    : { value: '---', unit: '' };

  // --- EXPORT TO JPG LOGIC ---
  const handleExport = async () => {
    if (!summaryRef.current) return;
    setIsExporting(true);
    
    try {
      const dataUrl = await htmlToImage.toJpeg(summaryRef.current, {
        quality: 0.95,
        pixelRatio: 3, // Gives you that crisp, high-res output (replaces 'scale: 3')
        backgroundColor: isDarkMode ? '#0f766e' : '#14b8a6',
      });
      
      const link = document.createElement("a");
      link.download = dreamItem ? `${dreamItem.replace(/\s+/g, '-').toLowerCase()}-daydream.jpg` : 'my-daydream.jpg';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export image", err);
    } finally {
      setIsExporting(false);
    }
  };

  const generateInsight = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dreamItem,
          income: totalIncome,
          expenses: totalExpenses,
          savings: totalSavings,
          leftover,
          months: timeDisplay.value,
          expenseDetails: expenseBreakdown // <--- Pass itemized data here
        }),
      });
      const data = await res.json();
      if (data.insight) setAiInsight(data.insight);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F9FA] dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 transition-colors duration-300 relative pb-24 lg:pb-0">

      <Header activeProfile={activeProfile} setActiveProfile={setActiveProfile} />

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="col-span-1 lg:col-span-12 flex justify-start">
            <button
              onClick={() => setShowHowItWorks(true)}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-zinc-500 hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 px-3.5 py-1.5 rounded-xl shadow-sm transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-teal-500" /> 
              How it works
            </button>
          </div>

          {/* DREAM ITEM ROW */}
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
            
            <div className="w-full md:w-auto bg-teal-500 dark:bg-teal-600 text-white p-6 rounded-3xl flex flex-col justify-center items-center md:items-start min-w-[200px] shadow-lg transition-colors duration-300 relative">
              <div className="flex items-center justify-between w-full gap-2">
                <span className="text-sm font-bold uppercase tracking-widest opacity-90">Time to Afford</span>
                <button 
                  onClick={() => setShowTimeInfo(true)}
                  className="p-1 rounded-full hover:bg-teal-600 dark:hover:bg-teal-700 text-teal-100 hover:text-white transition-colors"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl md:text-5xl font-black">{timeDisplay.value}</span>
                <span className="font-bold text-teal-100">{timeDisplay.unit}</span>
              </div>
            </div>
          </section>

          {/* CALCULATOR INPUTS */}
          <section  className="col-span-1 lg:col-span-8 bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-[2rem] shadow-sm border-2 border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-8 bg-teal-500 rounded-full shrink-0"></div>
                <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  Your Profile
                </h2>
              </div>
              <p className="ml-6 mt-1.5 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                Enter your monthly income and expenses below
              </p>
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
            
            {/* UPDATED BENTO: Financial Summary (4-Part Breakdown) */}
            <section className="bg-teal-500 dark:bg-teal-700 text-white rounded-[2rem] shadow-xl transition-colors duration-300 relative overflow-hidden flex flex-col">
              
              {/* THE EXPORT TARGET: We wrap only the content in the ref */}
              <div ref={summaryRef} className="p-8 pb-4 bg-teal-500 dark:bg-teal-700 relative">
                {/* Embedded Goal Info */}
                <div className="mb-6 bg-teal-600/50 dark:bg-teal-800/50 p-5 rounded-2xl border border-teal-400/30 dark:border-teal-600/50 text-center">
                  <p className="text-sm font-bold text-teal-100 uppercase tracking-widest mb-1">Daydreaming of</p>
                  <p className="text-2xl font-black text-white truncate px-2">{dreamItem || ''}</p>
                  <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-teal-400/30 dark:border-teal-600/50">
                    <span className="font-bold text-teal-200">₱{numericCost ? numericCost.toLocaleString() : '0'}</span>
                    <span className="text-teal-200/50">•</span>
                    <span className="font-bold text-white">{timeDisplay.value} {timeDisplay.unit}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-teal-100 uppercase tracking-widest mb-4">Financial Breakdown</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-teal-600/50 dark:bg-teal-800/50 p-3.5 rounded-xl border border-teal-400/30 dark:border-teal-600/50">
                    <span className="font-bold text-teal-50">1. Net Income</span>
                    <span className="font-black text-white text-lg">+{totalIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center bg-teal-600/50 dark:bg-teal-800/50 p-3.5 rounded-xl border border-teal-400/30 dark:border-teal-600/50">
                    <span className="font-bold text-teal-50">2. Expenses</span>
                    <span className="font-black text-orange-200 text-lg">-{totalExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center bg-teal-600/50 dark:bg-teal-800/50 p-3.5 rounded-xl border border-teal-400/30 dark:border-teal-600/50">
                    <span className="font-bold text-teal-50">3. Savings</span>
                    <span className="font-black text-teal-200 text-lg">-{totalSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>

                {/* VISUAL PROGRESS BAR */}
                <div className="mt-6 w-full bg-teal-700 dark:bg-teal-900 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-400' : 'bg-teal-200'}`}
                    style={{ width: `${expensePercentage}%` }}
                  ></div>
                </div>
                <div className="text-right mt-1">
                  <span className={`text-xs font-bold ${isOverBudget ? 'text-red-300' : 'text-teal-200'}`}>
                    {isOverBudget ? 'Over Budget' : `${expensePercentage.toFixed(0)}% Allocated`}
                  </span>
                </div>
                
                {/* RESPONSIVE WHAT'S LEFT SECTION */}
                <div className="mt-6 pt-6 border-t-2 border-teal-400 dark:border-teal-600 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-2 lg:gap-0">
                  <span className="font-bold text-teal-100 flex flex-col">
                    <span>4. What's Left</span>
                    <span className="text-[10px] uppercase tracking-wider opacity-70">For your goal</span>
                  </span>
                  <span className={`text-4xl font-black ${isOverBudget ? 'text-red-500' : 'text-white'}`}>
                    ₱{leftover.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                
                {/* Tiny watermark for the exported image */}
                <p className="text-center text-[10px] text-teal-200/60 font-bold uppercase tracking-widest mt-8">
                  daydream.waddleph.com
                </p>
              </div>

              {/* ACTION AREA (Inside the card visually, but excluded from export ref) */}
              <div className="px-8 pb-8 pt-2 flex justify-center">
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="bg-teal-800 dark:bg-teal-900 text-teal-50 hover:bg-teal-900 dark:hover:bg-zinc-900 font-bold text-sm py-2.5 px-6 rounded-full flex items-center justify-center gap-2 hover:scale-[1.05] hover:shadow-lg transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:hover:scale-100 border border-teal-600/50 dark:border-teal-800/50 shadow-md"
                >
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {isExporting ? 'Generating...' : 'Save as Image'}
                </button>
              </div>
            </section>

            {/* BENTO: AI Insights */}
            <section className="bg-teal-50 dark:bg-teal-950/20 p-8 rounded-[2rem] border-2 border-teal-200 dark:border-teal-900/50 relative overflow-hidden flex-1 flex flex-col justify-center transition-colors duration-300">
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <div className= " dark:bg-teal-800 p-2 rounded-xl transition-colors duration-300">
                  <img src="nootnoot.png" width={40} height={40} alt="" className='w-12 h-10 object-contain'/>
                </div>
                <h3 className="font-extrabold text-teal-900 dark:text-teal-400">Noot Noot</h3>
              </div>

              <div className="relative z-10 min-h-[80px] flex flex-col justify-center">
                {isGeneratingAI ? (
                  <div className="flex items-center gap-3 text-teal-700 dark:text-teal-400 font-bold">
                    <Loader2 className="w-5 h-5 animate-spin" /> 
                    <span>NootNoot is crunching the numbers...</span>
                  </div>
                ) : aiInsight ? (
                  <div className="space-y-4">
                    <p className="text-teal-900 dark:text-teal-300 font-medium leading-relaxed italic">
                      {aiInsight}
                    </p>
                    <button 
                      onClick={generateInsight}
                      className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider hover:underline"
                    >
                      Ask again
                    </button>
                  </div>
                ) : (
                  <button 
                    suppressHydrationWarning
                    onClick={generateInsight}
                    disabled={leftover <= 0}
                    className="w-full bg-teal-600 dark:bg-teal-700 text-white font-extrabold py-3.5 px-6 rounded-2xl hover:bg-teal-700 dark:hover:bg-teal-600 hover:scale-[1.02] active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    Ask NootNoot for advice!
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* STICKY MOBILE BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t-2 border-zinc-200 dark:border-zinc-800 p-4 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex justify-between items-center transition-colors duration-300">
        <div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">What's Left</p>
          <p className={`text-xl font-black ${isOverBudget ? 'text-red-500' : 'text-teal-600 dark:text-teal-400'}`}>
            ₱{leftover.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="flex flex-col items-end text-right">
          <div className="flex items-center gap-1">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Time to Afford</p>
            <button onClick={() => setShowTimeInfo(true)} className="text-zinc-400 hover:text-teal-500 transition-colors">
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xl font-black text-teal-600 dark:text-teal-400">
            {timeDisplay.value}
            <span className="text-sm font-bold opacity-80 ml-1">
              {timeDisplay.unit}
            </span>
          </p>
        </div>
      </div>

      <HowItWorksModal isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
      <TimeInfoModal isOpen={showTimeInfo} onClose={() => setShowTimeInfo(false)} />

      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-24 lg:bottom-6 right-6 z-50 p-3.5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-2xl border-2 border-zinc-700 dark:border-zinc-300 hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
        aria-label="Toggle Dark Mode"
      >
        {isDarkMode ? <Sun className="w-6 h-6 text-orange-400" /> : <Moon className="w-6 h-6 text-teal-400" />}
      </button>

      <Footer/>

    </div>
  );
}