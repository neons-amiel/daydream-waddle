'use client'
import React from 'react';
import { Baby, Plus, Trash2 } from 'lucide-react';

// ---------- child data + math (also used by ParentCalculator) ----------
export interface CustomExpense { id: string; label: string; value: string }

export type TuitionFrequency = 'monthly' | 'quarterly' | 'semestral' | 'yearly';

// How each option turns into a monthly amount (spread over 12 months so you save all year)
export const TUITION_OPTIONS: { value: TuitionFrequency; label: string; per: string; monthsCovered: number }[] = [
  { value: 'monthly',   label: 'Monthly',   per: 'month',    monthsCovered: 1 },
  { value: 'quarterly', label: 'Quarterly', per: 'quarter',  monthsCovered: 3 },
  { value: 'semestral', label: 'Per Sem',   per: 'semester', monthsCovered: 6 },
  { value: 'yearly',    label: 'Full Year', per: 'year',     monthsCovered: 12 },
];

export interface Child {
  id: string;
  name: string;
  tuition: string;
  /** Optional so kids saved before this existed default to monthly */
  tuitionFrequency?: TuitionFrequency;
  milk: string;
  dailyAllowance: string;
  custom: CustomExpense[];
}

const parseNum = (val: string) => Number(String(val).replace(/,/g, '')) || 0;
const formatInput = (raw: string) => {
  const numeric = raw.replace(/[^0-9]/g, '');
  return numeric === '' ? '' : Number(numeric).toLocaleString('en-US');
};
export const peso = (n: number) => `₱${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
const newId = () => Math.random().toString(36).substring(2, 9);

// 5 school days a week × 52 weeks ÷ 12 months ≈ 21.67 school days a month
const SCHOOL_DAYS_PER_MONTH = (5 * 52) / 12;

export const makeChild = (name: string): Child => ({
  id: newId(), name, tuition: '', tuitionFrequency: 'monthly', milk: '', dailyAllowance: '', custom: [],
});

const tuitionOption = (c: Child) =>
  TUITION_OPTIONS.find((o) => o.value === c.tuitionFrequency) ?? TUITION_OPTIONS[0];

/** Tuition converted to a monthly amount, e.g. ₱30,000 per sem → ₱5,000/mo */
export const childMonthlyTuition = (c: Child) =>
  Math.round(parseNum(c.tuition) / tuitionOption(c).monthsCovered);

export const childMonthlyAllowance = (c: Child) =>
  Math.round(parseNum(c.dailyAllowance) * SCHOOL_DAYS_PER_MONTH);

export const childTotal = (c: Child) =>
  childMonthlyTuition(c) +
  parseNum(c.milk) +
  childMonthlyAllowance(c) +
  c.custom.reduce((acc, item) => acc + parseNum(item.value), 0);

// ---------- component ----------
const ROW = 'flex justify-between items-center py-2 border-b-2 border-zinc-200 dark:border-zinc-700/50';
const INPUT =
  'w-28 text-right p-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 outline-none focus:border-teal-500 font-black text-zinc-900 dark:text-white transition-colors';

interface ChildCardProps {
  child: Child;
  onChange: (child: Child) => void;
  onRemove: () => void;
}

export default function ChildCard({ child, onChange, onRemove }: ChildCardProps) {
  const set = (patch: Partial<Child>) => onChange({ ...child, ...patch });
  const updateCustom = (id: string, patch: Partial<CustomExpense>) =>
    set({ custom: child.custom.map((c) => (c.id === id ? { ...c, ...patch } : c)) });

  const monthlyAllowance = childMonthlyAllowance(child);
  const monthlyTuition = childMonthlyTuition(child);
  const frequency = tuitionOption(child);
  const name = child.name || 'child';

  return (
    <div className="bg-zinc-50 dark:bg-zinc-800/40 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 p-6 animate-fadeIn transition-colors">

      {/* Header: icon, editable name, monthly total, remove */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <Baby className="w-6 h-6 text-orange-500 shrink-0" />
          <div className="min-w-0">
            <input
              type="text"
              value={child.name}
              onChange={(e) => set({ name: e.target.value })}
              aria-label="Child's name"
              placeholder="Child's name"
              maxLength={30}
              className="w-full font-extrabold text-lg text-zinc-800 dark:text-zinc-100 bg-transparent outline-none border-b border-dashed border-transparent hover:border-zinc-300 focus:border-orange-400 truncate"
            />
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mt-0.5">
              {peso(childTotal(child))} / month
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          aria-label={`Remove ${name}`}
          title="Remove child"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col space-y-3">
        {/* Tuition + how often it's paid */}
        <div className="py-2 border-b-2 border-zinc-200 dark:border-zinc-700/50 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-zinc-600 dark:text-zinc-200">Tuition</p>
              <p className="text-[11px] font-semibold text-zinc-400">
                {frequency.value !== 'monthly' && monthlyTuition > 0 ? (
                  <>= <span className="text-orange-500 font-bold">{peso(monthlyTuition)}</span>/mo · spread over {frequency.monthsCovered} months</>
                ) : (
                  `Amount per ${frequency.per}`
                )}
              </p>
            </div>
            <input
              type="text" inputMode="numeric" placeholder="0" className={INPUT}
              aria-label={`Tuition per ${frequency.per} for ${name}`}
              value={child.tuition}
              onChange={(e) => set({ tuition: formatInput(e.target.value) })}
            />
          </div>

          {/* Segmented control: all 4 options visible, one tap to switch */}
          <div
            role="radiogroup"
            aria-label={`How often ${name}'s tuition is paid`}
            className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-zinc-200/70 dark:bg-zinc-900"
          >
            {TUITION_OPTIONS.map((option) => {
              const selected = frequency.value === option.value;
              return (
                <label
                  key={option.value}
                  className={`text-center cursor-pointer rounded-lg py-1.5 text-[11px] font-extrabold transition-all ${
                    selected
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                  } has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal-500`}
                >
                  <input
                    type="radio"
                    name={`tuition-frequency-${child.id}`}
                    value={option.value}
                    checked={selected}
                    onChange={() => set({ tuitionFrequency: option.value })}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
        </div>

        {/* Daily allowance → monthly */}
        <div className={ROW}>
          <div>
            <p className="text-sm font-bold text-zinc-600 dark:text-zinc-200">Daily Allowance</p>
            <p className="text-[11px] font-semibold text-zinc-400">
              {monthlyAllowance > 0 ? (
                <>= <span className="text-orange-500 font-bold">{peso(monthlyAllowance)}</span>/mo · 5 school days a week</>
              ) : (
                'Enter per school day · let us do the monthly math :)'
              )}
            </p>
          </div>
          <input
            type="text" inputMode="numeric" placeholder="0" className={INPUT}
            aria-label={`Daily allowance for ${name}`}
            value={child.dailyAllowance}
            onChange={(e) => set({ dailyAllowance: formatInput(e.target.value) })}
          />
        </div>

        {/* Milk */}
        <div className={ROW}>
          <div>
            <p className="text-sm font-bold text-zinc-600 dark:text-zinc-200">Milk</p>
            <p className="text-[11px] font-semibold text-zinc-400">Per month</p>
          </div>
          <input
            type="text" inputMode="numeric" placeholder="0" className={INPUT}
            aria-label={`Milk for ${name}`}
            value={child.milk}
            onChange={(e) => set({ milk: formatInput(e.target.value) })}
          />
        </div>      
        
        {/* Custom expenses */}
        {child.custom.map((item) => (
          <div key={item.id} className={`${ROW} gap-3 animate-fadeIn`}>
            <input
              type="text"
              value={item.label}
              onChange={(e) => updateCustom(item.id, { label: e.target.value })}
              aria-label="Expense name"
              placeholder="Expense name"
              className="text-sm font-bold text-zinc-800 dark:text-zinc-200 bg-transparent outline-none border-b border-dashed border-zinc-400 focus:border-teal-500 flex-1 min-w-0"
            />
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => set({ custom: child.custom.filter((c) => c.id !== item.id) })}
                className="absolute -top-2.5 -right-2.5 z-10 bg-white dark:bg-zinc-800 text-zinc-400 hover:text-red-500 border border-zinc-200 dark:border-zinc-700 p-1 rounded-full shadow-sm transition-all hover:scale-110"
                aria-label="Remove expense"
                title="Delete expense"
              >
                <Trash2 className="w-3 h-3" />
              </button>
              <input
                type="text" inputMode="numeric" placeholder="0" className={INPUT}
                aria-label={`${item.label} amount`}
                value={item.value}
                onChange={(e) => updateCustom(item.id, { value: formatInput(e.target.value) })}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => set({ custom: [...child.custom, { id: newId(), label: 'Custom Expense', value: '' }] })}
        className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-orange-400 text-zinc-500 dark:text-zinc-400 hover:text-orange-500 font-bold text-sm transition-all"
      >
        <Plus className="w-4 h-4" /> Add an expense
      </button>
    </div>
  );
}