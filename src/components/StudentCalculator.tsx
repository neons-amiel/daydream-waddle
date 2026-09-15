'use client'
import React, { useState, useEffect } from 'react';
import ExpenseCategoryCard from './ExpenseCategoryCard';
import { Wallet, Bus, Utensils, Sparkles } from 'lucide-react';

export default function StudentCalculator({
  onUpdate
}: {
  onUpdate: (income: number, expenses: number, savings: number) => void
}) {
  // Income State (Daily Allowance & Monthly Side Hustle)
  const [allowance, setAllowance] = useState<string>('');
  const [sideHustle, setSideHustle] = useState<string>('');

  // Expenses Object (Holds all keys for student categories)
  const [exp, setExp] = useState<Record<string, string>>({});

  const parseNum = (val: string) => Number(String(val).replace(/,/g, '')) || 0;

  useEffect(() => {
    // Math: Convert Daily Allowance to Monthly (~30 days), add Monthly Side Hustle
    const monthlyAllowance = parseNum(allowance) * 30;
    const totalIncome = monthlyAllowance + parseNum(sideHustle);
    
    // Math: Sum all daily/item expenses, convert base expenses to monthly (~30 days)
    const baseExpensesDaily = Object.values(exp).reduce((acc, val) => acc + parseNum(val), 0);
    const monthlyBaseExpenses = baseExpensesDaily * 30;

    // Student profile has no separate savings-percentage feature (unlike Adult),
    // so we report 0 for savings - "Personal Spending Fund" stays a plain expense.
    onUpdate(totalIncome, monthlyBaseExpenses, 0);
  }, [allowance, sideHustle, exp, onUpdate]);

  const updateExp = (key: string, value: string) => {
    setExp(prev => ({ ...prev, [key]: value }));
  };

  const handleAllowanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setAllowance(rawValue === '' ? '' : Number(rawValue).toLocaleString('en-US'));
  };

  const handleSideHustleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setSideHustle(rawValue === '' ? '' : Number(rawValue).toLocaleString('en-US'));
  };

  return (
    <div className="space-y-6">

      {/* INCOME BENTO BOX */}
      <div className="bg-teal-50 dark:bg-teal-950/20 p-6 rounded-3xl border-2 border-teal-200 dark:border-teal-900/50 space-y-6 transition-colors">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div>
            <h3 className="font-extrabold text-teal-800 dark:text-teal-400 text-xl">Student Income</h3>
            <p className="text-xs font-bold text-teal-600 dark:text-teal-500 uppercase tracking-widest mt-1">Allowance & Side Hustles</p>
          </div>
          <span className="text-xs font-bold bg-teal-200/60 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 px-3 py-1.5 rounded-xl">
            Calculated Monthly
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Daily Allowance Input */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border-2 border-teal-200 dark:border-teal-800 flex items-center justify-between shadow-sm">
            <div>
              <span className="block font-bold text-sm text-zinc-800 dark:text-zinc-200">Daily Allowance</span>
              <span className="text-xs text-zinc-400">Multiplied by 30 days</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-teal-500">₱</span>
              <input 
                type="text" 
                inputMode="numeric"
                className="w-24 text-right p-1 bg-transparent outline-none font-black text-xl text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                placeholder="0" 
                value={allowance} 
                onChange={handleAllowanceChange}
              />
            </div>
          </div>

          {/* Side Hustle Input */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border-2 border-teal-200 dark:border-teal-800 flex items-center justify-between shadow-sm">
            <div>
              <span className="block font-bold text-sm text-zinc-800 dark:text-zinc-200">Side Hustle</span>
              <span className="text-xs text-zinc-400">Total monthly earnings</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-teal-500">₱</span>
              <input 
                type="text" 
                inputMode="numeric"
                className="w-24 text-right p-1 bg-transparent outline-none font-black text-xl text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                placeholder="0" 
                value={sideHustle} 
                onChange={handleSideHustleChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* EXPENSE CATEGORIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        <ExpenseCategoryCard 
          title="Daily Commute" 
          accentColor="text-blue-400"
          icon={Bus}
          initialItems={[
            { key: 'commuteSchool', label: 'Commute (To School)' },
            { key: 'commuteHome', label: 'Commute (To Home)' }
          ]}
          values={exp}
          onChange={updateExp}
        />

        <ExpenseCategoryCard 
          title="Food & Meals" 
          accentColor="text-orange-400"
          icon={Utensils}
          initialItems={[
            { key: 'recess', label: 'Recess' },
            { key: 'lunch', label: 'Lunch' },
            { key: 'afterSchool', label: 'After School Snacks' }
          ]}
          values={exp}
          onChange={updateExp}
        />

        <ExpenseCategoryCard 
          title="School & Personal" 
          accentColor="text-teal-400"
          icon={Wallet}
          initialItems={[
            { key: 'others', label: 'Others / Printing / Projects' }
          ]}
          values={exp}
          onChange={updateExp}
        />

        <ExpenseCategoryCard 
          title="Extra Allocation" 
          accentColor="text-purple-400"
          icon={Sparkles}
          initialItems={[
            { key: 'savings', label: 'Personal Spending Fund' }
          ]}
          values={exp}
          onChange={updateExp}
        />

      </div>

    </div>
  );
}