'use client'
import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface ExpenseItem {
  id: string;
  label: string;
  value: string;
}

interface ExpenseCategoryCardProps {
  title: string;
  accentColor: string; 
  initialItems: { key: string; label: string }[];
  values: Record<string, string>;
  onChange: (key: string, val: string) => void;
}

export default function ExpenseCategoryCard({
  title,
  accentColor,
  initialItems,
  values,
  onChange
}: ExpenseCategoryCardProps) {
  const [customItems, setCustomItems] = useState<ExpenseItem[]>([]);
  const [customValues, setCustomValues] = useState<Record<string, string>>({});

  const handleCustomChange = (id: string, rawVal: string) => {
    const numeric = rawVal.replace(/[^0-9]/g, '');
    const formatted = numeric === '' ? '' : Number(numeric).toLocaleString('en-US');
    setCustomValues(prev => ({ ...prev, [id]: formatted }));
    onChange(`custom_${id}`, formatted);
  };

  const addCustomExpense = () => {
    const id = Math.random().toString(36).substring(2, 9);
    setCustomItems(prev => [...prev, { id, label: 'Custom Expense', value: '' }]);
  };

  const removeCustomExpense = (id: string) => {
    setCustomItems(prev => prev.filter(item => item.id !== id));
    onChange(`custom_${id}`, ''); 
  };

  const updateCustomLabel = (id: string, newLabel: string) => {
    setCustomItems(prev => prev.map(item => item.id === id ? { ...item, label: newLabel } : item));
  };

  const formatInput = (raw: string) => {
    const numeric = raw.replace(/[^0-9]/g, '');
    return numeric === '' ? '' : Number(numeric).toLocaleString('en-US');
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-800/40 p-6 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-2 h-6 ${accentColor} rounded-full`}></div>
          <h4 className="font-extrabold text-lg text-zinc-800 dark:text-zinc-100">{title}</h4>
        </div>
        
        <div className="flex flex-col space-y-3">
          {/* Default Preset Rows */}
          {initialItems.map(({ key, label }) => (
            <div key={key} className="flex justify-between items-center py-2 border-b-2 border-zinc-200 dark:border-zinc-700/50">
              <label className="text-sm font-bold text-zinc-600 dark:text-zinc-400">{label}</label>
              <input 
                type="text" 
                inputMode="numeric"
                className="w-28 text-right p-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 outline-none focus:border-teal-500 font-black text-zinc-900 dark:text-white transition-colors"
                placeholder="0" 
                value={values[key] || ''} 
                onChange={(e) => onChange(key, formatInput(e.target.value))}
              />
            </div>
          ))}

          {/* User-Added Custom Expense Rows with Corner-Overlapping Delete Button */}
          {customItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b-2 border-zinc-200 dark:border-zinc-700/50 animate-fadeIn gap-3">
              <input 
                type="text" 
                value={item.label}
                onChange={(e) => updateCustomLabel(item.id, e.target.value)}
                className="text-sm font-bold text-zinc-800 dark:text-zinc-200 bg-transparent outline-none border-b border-dashed border-zinc-400 focus:border-teal-500 flex-1 min-w-0"
                placeholder="Expense name"
              />
              
              {/* Input container made relative so the delete button can overlap the top-right corner */}
              <div className="relative flex-shrink-0">
                <button 
                  onClick={() => removeCustomExpense(item.id)}
                  className="absolute -top-2.5 -right-2.5 z-10 bg-white dark:bg-zinc-800 text-zinc-400 hover:text-red-500 border border-zinc-200 dark:border-zinc-700 p-1 rounded-full shadow-sm transition-all hover:scale-110"
                  aria-label="Remove item"
                  title="Delete expense"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <input 
                  type="text" 
                  inputMode="numeric"
                  className="w-28 text-right p-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 outline-none focus:border-teal-500 font-black text-zinc-900 dark:text-white transition-colors"
                  placeholder="0" 
                  value={customValues[item.id] || ''}
                  onChange={(e) => handleCustomChange(item.id, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Expense Button */}
      <button 
        onClick={addCustomExpense}
        className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-teal-500 dark:hover:border-teal-500 text-zinc-500 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-400 font-bold text-sm transition-all"
      >
        <Plus className="w-4 h-4" /> Add an expense
      </button>
    </div>
  );
}