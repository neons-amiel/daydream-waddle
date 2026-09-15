'use client'
import React, { useState, useEffect } from 'react';
import ExpenseCategoryCard from './ExpenseCategoryCard';

export default function AdultCalculator({ onUpdate }: { onUpdate: (income: number, expenses: number) => void }) {
  const [salary, setSalary] = useState<string>('');

  // Expenses Object (Holds all keys, including dynamic custom ones)
  const [exp, setExp] = useState<Record<string, string>>({});
  const [savingsPercent, setSavingsPercent] = useState<number>(30);

  const parseNum = (val: string) => Number(String(val).replace(/,/g, '')) || 0;

  useEffect(() => {
    const totalIncome = parseNum(salary);
    const baseExpenses = Object.values(exp).reduce((acc, val) => acc + parseNum(val), 0);
    const savingsAmount = totalIncome * (savingsPercent / 100);

    onUpdate(totalIncome, baseExpenses + savingsAmount);
  }, [salary, exp, savingsPercent, onUpdate]);

  const updateExp = (key: string, value: string) => {
    setExp(prev => ({ ...prev, [key]: value }));
  };

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

      {/* EXPENSE CATEGORIES GRID USING REUSABLE COMPONENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <ExpenseCategoryCard 
          title="Home & Living" 
          accentColor="bg-orange-400"
          initialItems={[
            { key: 'rent', label: 'Rent / Amortization' },
            { key: 'elect', label: 'Electricity' },
            { key: 'water', label: 'Water' },
            { key: 'groceries', label: 'Groceries' },
            { key: 'food', label: 'Outside Food' }
          ]}
          values={exp}
          onChange={updateExp}
        />

        <ExpenseCategoryCard 
          title="Subscriptions" 
          accentColor="bg-teal-400"
          initialItems={[
            { key: 'wifi', label: 'Wi-Fi' },
            { key: 'netflix', label: 'Netflix' },
            { key: 'spotify', label: 'Spotify' },
            { key: 'youtube', label: 'YouTube Premium' },
            { key: 'phone', label: 'Data/Phone Bill' }
          ]}
          values={exp}
          onChange={updateExp}
        />

        <ExpenseCategoryCard 
          title="Transportation" 
          accentColor="bg-blue-400"
          initialItems={[
            { key: 'commute', label: 'Commute Money' },
            { key: 'gas', label: 'Gas' },
            { key: 'carAmort', label: 'Car Amortization' }
          ]}
          values={exp}
          onChange={updateExp}
        />

        <ExpenseCategoryCard 
          title="Obligations" 
          accentColor="bg-purple-400"
          initialItems={[
            { key: 'family', label: 'Money for Family' },
            { key: 'lifeIns', label: 'Life Insurance' },
            { key: 'carIns', label: 'Car Insurance' },
            { key: 'homeIns', label: 'Home Insurance' }
          ]}
          values={exp}
          onChange={updateExp}
        />

      </div>

      {/* SAVINGS SLIDER BENTO */}
      <div className="bg-teal-500 dark:bg-teal-700 text-white p-6 md:p-8 rounded-[2rem] shadow-xl mt-4 transition-colors duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h3 className="font-black text-2xl text-white">Mandatory Savings</h3>
            <p className="text-sm font-bold text-teal-100 mt-1 uppercase tracking-wider">Recommended: 30% of salary</p>
          </div>
          <div className="bg-teal-600 dark:bg-teal-800 px-5 py-2 rounded-2xl">
             <span className="text-3xl font-black text-white">{savingsPercent}%</span>
          </div>
        </div>

        <input 
          type="range" min="0" max="100" value={savingsPercent}
          onChange={(e) => setSavingsPercent(Number(e.target.value))}
          className="w-full h-3 bg-teal-700 dark:bg-teal-900 rounded-lg appearance-none cursor-pointer accent-white outline-none"
        />

        <div className="flex justify-between items-end mt-6 pt-4 border-t-2 border-teal-400 dark:border-teal-600">
          <span className="font-bold text-teal-100 uppercase tracking-widest text-sm">Monthly Target</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-teal-200">₱</span>
            <span className="text-3xl font-black text-white">
              {(parseNum(salary) * (savingsPercent / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}