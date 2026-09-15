'use client'
import React, { useState, useEffect } from 'react';

// 1. THIS IS OUTSIDE: Handles comma formatting and maintains focus
const InputRow = ({ label, value, setter }: { label: string, value: string, setter: (val: string) => void }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Strip out everything except numbers
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    if (rawValue === '') {
      setter('');
    } else {
      // Add commas back in
      setter(Number(rawValue).toLocaleString('en-US'));
    }
  };

  return (
    <div className="flex justify-between items-center py-3 border-b-2 border-zinc-200 dark:border-zinc-700/50 last:border-0">
      <label className="text-sm font-bold text-zinc-600 dark:text-zinc-400">{label}</label>
      <input 
        type="text" 
        inputMode="numeric"
        className="w-28 text-right p-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 outline-none focus:border-teal-500 font-black text-zinc-900 dark:text-white transition-colors"
        placeholder="0" 
        value={value} 
        onChange={handleChange}
      />
    </div>
  );
};

export default function AdultCalculator({ onUpdate }: { onUpdate: (income: number, expenses: number) => void }) {
  const [salary, setSalary] = useState<string>('');

  // Expenses Object (Stored as formatted strings)
  const [exp, setExp] = useState({
    rent: '', elect: '', water: '', groceries: '', food: '',
    wifi: '', netflix: '', spotify: '', youtube: '', phone: '',
    commute: '', gas: '', carAmort: '',
    family: '',
    lifeIns: '', carIns: '', homeIns: ''
  });

  const [savingsPercent, setSavingsPercent] = useState<number>(30);

  // Helper to parse strings back to numbers for math
  const parseNum = (val: string) => Number(val.replace(/,/g, '')) || 0;

  useEffect(() => {
    const totalIncome = parseNum(salary);
    const baseExpenses = Object.values(exp).reduce((acc, val) => acc + parseNum(val), 0);
    const savingsAmount = totalIncome * (savingsPercent / 100);

    onUpdate(totalIncome, baseExpenses + savingsAmount);
  }, [salary, exp, savingsPercent, onUpdate]);

  const updateExp = (key: keyof typeof exp, value: string) => setExp(prev => ({ ...prev, [key]: value }));

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setSalary(rawValue === '' ? '' : Number(rawValue).toLocaleString('en-US'));
  };

  return (
    <div className="space-y-6">

      {/* SALARY BENTO BOX */}
      <div className="bg-teal-50 dark:bg-teal-950/20 p-6 rounded-3xl border-2 border-teal-200 dark:border-teal-900/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors">
        <div>
          <h3 className="font-extrabold text-teal-800 dark:text-teal-400 text-xl">Net Salary</h3>
          <p className="text-xs font-bold text-teal-600 dark:text-teal-500 uppercase tracking-widest mt-1">Monthly Income</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-2 rounded-2xl border-2 border-teal-200 dark:border-teal-800 focus-within:border-teal-500 transition-colors w-full md:w-auto shadow-sm">
          <span className="pl-3 font-bold text-teal-500 dark:text-teal-400 text-xl">₱</span>
          <input 
            type="text" 
            inputMode="numeric"
            className="w-full md:w-36 text-right p-2 bg-transparent outline-none font-black text-2xl text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
            placeholder="0" 
            value={salary} 
            onChange={handleSalaryChange}
          />
        </div>
      </div>

      {/* EXPENSE CATEGORIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Category: Home & Living */}
        <div className="bg-zinc-50 dark:bg-zinc-800/40 p-6 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-6 bg-orange-400 rounded-full"></div>
            <h4 className="font-extrabold text-lg text-zinc-800 dark:text-zinc-100">Home & Living</h4>
          </div>
          <div className="flex flex-col">
            <InputRow label="Rent / Amortization" value={exp.rent} setter={(val) => updateExp('rent', val)} />
            <InputRow label="Electricity" value={exp.elect} setter={(val) => updateExp('elect', val)} />
            <InputRow label="Water" value={exp.water} setter={(val) => updateExp('water', val)} />
            <InputRow label="Groceries" value={exp.groceries} setter={(val) => updateExp('groceries', val)} />
            <InputRow label="Outside Food" value={exp.food} setter={(val) => updateExp('food', val)} />
          </div>
        </div>

        {/* Category: Subscriptions */}
        <div className="bg-zinc-50 dark:bg-zinc-800/40 p-6 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-6 bg-teal-400 rounded-full"></div>
            <h4 className="font-extrabold text-lg text-zinc-800 dark:text-zinc-100">Subscriptions</h4>
          </div>
          <div className="flex flex-col">
            <InputRow label="Wi-Fi" value={exp.wifi} setter={(val) => updateExp('wifi', val)} />
            <InputRow label="Netflix" value={exp.netflix} setter={(val) => updateExp('netflix', val)} />
            <InputRow label="Spotify" value={exp.spotify} setter={(val) => updateExp('spotify', val)} />
            <InputRow label="YouTube Premium" value={exp.youtube} setter={(val) => updateExp('youtube', val)} />
            <InputRow label="Data/Phone Bill" value={exp.phone} setter={(val) => updateExp('phone', val)} />
          </div>
        </div>

        {/* Category: Transportation */}
        <div className="bg-zinc-50 dark:bg-zinc-800/40 p-6 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-6 bg-blue-400 rounded-full"></div>
            <h4 className="font-extrabold text-lg text-zinc-800 dark:text-zinc-100">Transportation</h4>
          </div>
          <div className="flex flex-col">
            <InputRow label="Commute Money" value={exp.commute} setter={(val) => updateExp('commute', val)} />
            <InputRow label="Gas" value={exp.gas} setter={(val) => updateExp('gas', val)} />
            <InputRow label="Car Amortization" value={exp.carAmort} setter={(val) => updateExp('carAmort', val)} />
          </div>
        </div>

        {/* Category: Obligations */}
        <div className="bg-zinc-50 dark:bg-zinc-800/40 p-6 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-6 bg-purple-400 rounded-full"></div>
            <h4 className="font-extrabold text-lg text-zinc-800 dark:text-zinc-100">Obligations</h4>
          </div>
          <div className="flex flex-col">
            <InputRow label="Money for Family" value={exp.family} setter={(val) => updateExp('family', val)} />
            <InputRow label="Life Insurance" value={exp.lifeIns} setter={(val) => updateExp('lifeIns', val)} />
            <InputRow label="Car Insurance" value={exp.carIns} setter={(val) => updateExp('carIns', val)} />
            <InputRow label="Home Insurance" value={exp.homeIns} setter={(val) => updateExp('homeIns', val)} />
          </div>
        </div>
      </div>

      {/* SAVINGS SLIDER BENTO (Dark Contrast Motif) */}
      <div className="bg-zinc-900 text-white p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden mt-4">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/20 rounded-full blur-3xl -mr-10 -mt-10"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 relative z-10 gap-4">
          <div>
            <h3 className="font-black text-2xl text-white">Mandatory Savings</h3>
            <p className="text-sm font-bold text-zinc-400 mt-1 uppercase tracking-wider">Recommended: 30% of salary</p>
          </div>
          <div className="bg-zinc-800 px-5 py-2 rounded-2xl border-2 border-zinc-700">
             <span className="text-3xl font-black text-orange-400">{savingsPercent}%</span>
          </div>
        </div>

        <input 
          type="range" min="0" max="100" value={savingsPercent}
          onChange={(e) => setSavingsPercent(Number(e.target.value))}
          className="w-full h-3 bg-zinc-700 rounded-lg appearance-none cursor-pointer relative z-10 accent-orange-400"
        />

        <div className="flex justify-between items-end mt-6 relative z-10 pt-4 border-t-2 border-zinc-800">
          <span className="font-bold text-zinc-400 uppercase tracking-widest text-sm">Monthly Target</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-zinc-500">₱</span>
            <span className="text-3xl font-black text-white">
              {(parseNum(salary) * (savingsPercent / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}