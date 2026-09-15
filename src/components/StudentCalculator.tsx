'use client'
import React, { useState, useEffect } from 'react';

// The InputRow remains exactly the same, outside the main component!
const InputRow = ({ label, value, setter }: { label: string, value: string, setter: (val: string) => void }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    
    if (rawValue === '') {
      setter('');
    } else {
      setter(Number(rawValue).toLocaleString('en-US'));
    }
  };

  return (
    <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800/50">
      <label className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{label}</label>
      <input 
        type="text" 
        inputMode="numeric"
        className="w-24 text-right p-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 outline-none focus:border-blue-500 text-sm"
        placeholder="0" 
        value={value} 
        onChange={handleChange}
      />
    </div>
  );
};

export default function StudentCalculator({ onUpdate }: { onUpdate: (income: number, expenses: number) => void }) {
  // Income 
  const [allowance, setAllowance] = useState<string>('');
  const [sideHustle, setSideHustle] = useState<string>('');

  // Expenses (All Daily)
  const [commuteSchool, setCommuteSchool] = useState<string>('');
  const [commuteHome, setCommuteHome] = useState<string>('');
  const [recess, setRecess] = useState<string>('');
  const [lunch, setLunch] = useState<string>('');
  const [afterSchool, setAfterSchool] = useState<string>('');
  const [others, setOthers] = useState<string>('');
  const [savings, setSavings] = useState<string>('');

  const parseNum = (val: string) => Number(val.replace(/,/g, '')) || 0;

  useEffect(() => {
    // Math: Convert Daily Allowance to Monthly (x30), add Monthly Side Hustle
    const monthlyIncome = (parseNum(allowance) * 30) + parseNum(sideHustle);
    
    // Math: Sum all daily expenses, then convert to Monthly (x30)
    const dailyExpensesSum = 
      parseNum(commuteSchool) + parseNum(commuteHome) + 
      parseNum(recess) + parseNum(lunch) + 
      parseNum(afterSchool) + parseNum(others) + parseNum(savings);
      
    const monthlyExpenses = dailyExpensesSum * 30;
    
    onUpdate(monthlyIncome, monthlyExpenses);
  }, [allowance, sideHustle, commuteSchool, commuteHome, recess, lunch, afterSchool, others, savings, onUpdate]);

  return (
    <div className="space-y-6">
      <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-green-800 dark:text-green-400">Income</h3>
          <span className="text-xs text-green-600 dark:text-green-500 font-medium bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-md">Calculated Monthly</span>
        </div>
        <InputRow label="Allowance (Daily)" value={allowance} setter={setAllowance} />
        <InputRow label="Side Hustles (Amount you make in a month from side hustles)" value={sideHustle} setter={setSideHustle} />
      </div>

      <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-red-800 dark:text-red-400">Expenses</h3>
          <span className="text-xs text-red-600 dark:text-red-500 font-medium bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-md">Input Daily Amounts</span>
        </div>
        <InputRow label="Commute (To School)" value={commuteSchool} setter={setCommuteSchool} />
        <InputRow label="Commute (To Home)" value={commuteHome} setter={setCommuteHome} />
        <InputRow label="Recess" value={recess} setter={setRecess} />
        <InputRow label="Lunch" value={lunch} setter={setLunch} />
        <InputRow label="After School" value={afterSchool} setter={setAfterSchool} />
        <InputRow label="Others" value={others} setter={setOthers} />
        <InputRow label="Savings" value={savings} setter={setSavings} />
      </div>
    </div>
  );
}