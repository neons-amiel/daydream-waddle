'use client'
import React, { useState, useEffect } from 'react';
import ExpenseCategoryCard from './ExpenseCategoryCard';
import SavingsInfoModal from './SavingsInfoModal';
import ChildCard, { Child, makeChild, childTotal, childMonthlyAllowance, peso } from './ChildCard';
import { usePersistentState, migrateLegacyProfiles } from './usePersistentState';
import { Home, Tv, Car, ShieldCheck, Info, Plus, Check, X } from 'lucide-react';

// Move saved numbers from the old Adult/Parent profiles before anything reads them
migrateLegacyProfiles();

const parseNum = (val: string) => Number(String(val).replace(/,/g, '')) || 0;
const formatInput = (raw: string) => {
  const numeric = raw.replace(/[^0-9]/g, '');
  return numeric === '' ? '' : Number(numeric).toLocaleString('en-US');
};

// ---------- small local helpers ----------

// Big ₱ salary input
function SalaryInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-2 rounded-2xl border-2 border-teal-200 dark:border-teal-800 focus-within:border-teal-500 transition-colors w-full md:w-auto shadow-sm">
      <span className="pl-3 font-bold text-teal-500 dark:text-teal-400 text-xl">₱</span>
      <input
        type="text"
        inputMode="numeric"
        aria-label={label}
        className="w-full md:w-36 text-right p-2 bg-transparent outline-none font-black text-2xl text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
        placeholder="0"
        value={value}
        onChange={(e) => onChange(formatInput(e.target.value))}
      />
    </div>
  );
}

// Checkbox row; only the box turns orange
function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span
        aria-hidden
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-orange-400 peer-focus-visible:ring-offset-2 ${
          checked ? 'bg-orange-500 border-orange-500' : 'border-zinc-300 dark:border-zinc-600'
        }`}
      >
        {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-extrabold text-zinc-800 dark:text-zinc-100">{label}</span>
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{hint}</span>
      </span>
    </label>
  );
}

// Smooth open/close, same trick as ExpenseCategoryCard. `inert` keeps hidden fields out of tab order.
function Reveal({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      inert={!open}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

// Modal shell (same look as SavingsInfoModal) used by the add/remove dialogs
function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div role="dialog" aria-modal="true" aria-label={title} className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-6 md:p-8 rounded-[2rem] shadow-2xl max-w-md w-full relative">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute top-6 right-6 p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 transition-colors">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 pr-12 mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}

const CANCEL_BTN = 'flex-1 py-3.5 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 font-extrabold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors';

// ---------- main ----------
export default function DaydreamCalculator({
  onUpdate,
}: {
  onUpdate: (income: number, expenses: number, savings: number, details?: Record<string, string>) => void;
}) {
  // Saved to the browser (see usePersistentState.ts)
  const [salary, setSalary] = usePersistentState<string>('calc:salary', '');
  const [hasSecondIncome, setHasSecondIncome] = usePersistentState<boolean>('calc:hasSecondIncome', false);
  const [secondSalary, setSecondSalary] = usePersistentState<string>('calc:secondSalary', '');
  const [hasKids, setHasKids] = usePersistentState<boolean>('calc:hasKids', false);
  const [kids, setKids] = usePersistentState<Child[]>('calc:kids', []);
  const [exp, setExp] = usePersistentState<Record<string, string>>('calc:expenses', {});
  const [savingsPercent, setSavingsPercent] = usePersistentState<number>('calc:savingsPercent', 30);

  // UI-only state (not saved)
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [childToRemove, setChildToRemove] = useState<Child | null>(null);
  const [showSavingsInfo, setShowSavingsInfo] = useState(false);

  // Toggling a section off keeps what was typed but leaves it out of the totals.
  const totalIncome = parseNum(salary) + (hasSecondIncome ? parseNum(secondSalary) : 0);
  const kidsTotal = hasKids ? kids.reduce((acc, c) => acc + childTotal(c), 0) : 0;
  const savingsAmount = totalIncome * (savingsPercent / 100);

  useEffect(() => {
    const baseExpenses = Object.values(exp).reduce((acc, val) => acc + parseNum(val), 0);

    // Add each child's expenses to the breakdown so Noot Noot can see them
    const details: Record<string, string> = { ...exp };
    if (hasKids) {
      kids.forEach((c, i) => {
        const name = c.name.trim() || `Child ${i + 1}`;
        if (c.tuition) details[`${name} - Tuition`] = c.tuition;
        if (c.milk) details[`${name} - Milk`] = c.milk;
        const allowance = childMonthlyAllowance(c);
        if (allowance) details[`${name} - Allowance`] = allowance.toLocaleString('en-US');
        c.custom.forEach((item) => {
          if (item.value) details[`${name} - ${item.label || 'Custom'}`] = item.value;
        });
      });
    }

    onUpdate(totalIncome, baseExpenses + kidsTotal, savingsAmount, details);
  }, [exp, kids, hasKids, totalIncome, kidsTotal, savingsAmount, onUpdate]);

  const updateExp = (key: string, value: string) => setExp((prev) => ({ ...prev, [key]: value }));

  // --- kids flow ---
  const defaultChildName = `Child ${kids.length + 1}`;

  // Ticking the box with no kids yet opens "Add a child" straight away
  const handleKidsToggle = (checked: boolean) => {
    setHasKids(checked);
    if (checked && kids.length === 0) setShowAddChild(true);
  };

  const addChild = (e: React.FormEvent) => {
    e.preventDefault();
    setKids((prev) => [...prev, makeChild(newChildName.trim() || defaultChildName)]);
    setNewChildName('');
    setShowAddChild(false);
  };

  // Cancelling the very first child un-ticks the box again
  const cancelAddChild = () => {
    setNewChildName('');
    setShowAddChild(false);
    if (kids.length === 0) setHasKids(false);
  };

  const confirmRemoveChild = () => {
    if (!childToRemove) return;
    const remaining = kids.filter((c) => c.id !== childToRemove.id);
    setKids(remaining);
    if (remaining.length === 0) setHasKids(false);
    setChildToRemove(null);
  };

  const updateChild = (updated: Child) => setKids((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));

  return (
    <div className="space-y-6">

      {/* 1. SALARY BENTO */}
      <div className="bg-teal-50 dark:bg-teal-950/20 p-6 rounded-3xl border-2 border-teal-200 dark:border-teal-900/50 transition-colors space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-extrabold text-teal-800 dark:text-teal-400 text-xl">{hasSecondIncome ? 'Your Net Salary' : 'Net Salary'}</h3>
            <p className="text-xs font-bold text-teal-600 dark:text-teal-500 uppercase tracking-widest mt-1">Monthly Income</p>
          </div>
          <SalaryInput value={salary} onChange={setSalary} label="Your monthly net salary" />
        </div>

        <Toggle
          checked={hasSecondIncome}
          onChange={setHasSecondIncome}
          label="Add a second household income"
          hint="Someone else who chips in, like a partner, spouse or housemate"
        />

        <Reveal open={hasSecondIncome}>
          <div className="space-y-4 pt-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-extrabold text-teal-800 dark:text-teal-400 text-xl">Second Net Salary</h3>
                <p className="text-xs font-bold text-teal-600 dark:text-teal-500 uppercase tracking-widest mt-1">Monthly Income</p>
              </div>
              <SalaryInput value={secondSalary} onChange={setSecondSalary} label="Second monthly net salary" />
            </div>

            <div className="flex justify-between items-center bg-teal-500 dark:bg-teal-700 text-white rounded-2xl px-5 py-4 shadow-md">
              <div>
                <p className="font-black text-lg">Total Net Salary</p>
                <p className="text-[11px] font-bold uppercase tracking-widest text-teal-100">Combined monthly income</p>
              </div>
              <span className="text-3xl font-black">{peso(totalIncome)}</span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* 2. KIDS */}
      <div className="space-y-4">
        <Toggle
          checked={hasKids}
          onChange={handleKidsToggle}
          label="I have kids to budget for"
          hint="Tuition, milk, baon and anything else they need"
        />

        <Reveal open={hasKids && kids.length > 0}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-1">
            {kids.map((child) => (
              <ChildCard key={child.id} child={child} onChange={updateChild} onRemove={() => setChildToRemove(child)} />
            ))}

            {/* Sits in the next grid cell, so it lands beside the last child */}
            <button
              type="button"
              onClick={() => setShowAddChild(true)}
              className="min-h-[12rem] h-full flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-orange-400 hover:text-orange-500 font-extrabold transition-all active:scale-[0.98]"
            >
              <Plus className="w-6 h-6" />
              Add another child
            </button>
          </div>

          <div className="flex justify-between items-center mt-4 px-2">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
              Kids total · {kids.length} {kids.length === 1 ? 'child' : 'children'}
            </span>
            <span className="font-black text-lg text-zinc-900 dark:text-white">{peso(kidsTotal)}</span>
          </div>
        </Reveal>
      </div>

      {/* 3. SAVINGS SLIDER */}
      <div className="bg-teal-500 dark:bg-teal-700 text-white p-6 md:p-8 rounded-[2rem] shadow-xl transition-colors duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-2xl text-white">Mandatory Savings</h3>
              <button
                onClick={() => setShowSavingsInfo(true)}
                className="p-1 rounded-full hover:bg-teal-600 dark:hover:bg-teal-800 text-teal-100 hover:text-white transition-colors"
                aria-label="More information about Mandatory Savings"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm font-bold text-teal-100 mt-1 uppercase tracking-wider">
              Recommended: 30% of {hasSecondIncome ? 'total income' : 'salary'}
            </p>
          </div>
          <div className="bg-teal-600 dark:bg-teal-800 px-5 py-2 rounded-2xl">
            <span className="text-3xl font-black text-white">{savingsPercent}%</span>
          </div>
        </div>

        <div className="relative w-full h-3">
          <div className="absolute inset-0 bg-teal-700 dark:bg-teal-900 rounded-lg" />
          <div className="absolute inset-y-0 left-0 bg-white rounded-lg pointer-events-none" style={{ width: `${savingsPercent}%` }} />
          <input
            type="range" min="0" max="100" value={savingsPercent}
            aria-label="Savings percentage"
            onChange={(e) => setSavingsPercent(Number(e.target.value))}
            className="absolute inset-0 w-full h-3 appearance-none bg-transparent cursor-pointer outline-none
              [&::-webkit-slider-runnable-track]:bg-transparent
              [&::-moz-range-track]:bg-transparent
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:mt-[-2px]
              [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
          />
        </div>

        <div className="flex justify-between items-end mt-6 pt-4 border-t-2 border-teal-400 dark:border-teal-600">
          <span className="font-bold text-teal-100 uppercase tracking-widest text-sm">Monthly Target</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-teal-200">₱</span>
            <span className="text-3xl font-black text-white">
              {savingsAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>

      {/* 4. EXPENSE CATEGORIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <ExpenseCategoryCard
          storageKey="calc:home"
          title="Home & Living"
          accentColor="text-orange-400"
          icon={Home}
          initialItems={[
            { key: 'rent', label: 'Rent / Amortization' },
            { key: 'elect', label: 'Electricity' },
            { key: 'water', label: 'Water' },
            { key: 'groceries', label: 'Groceries' },
            { key: 'food', label: 'Outside Food' },
          ]}
          values={exp}
          onChange={updateExp}
        />
        <ExpenseCategoryCard
          storageKey="calc:subscriptions"
          title="Subscriptions"
          accentColor="text-teal-400"
          icon={Tv}
          initialItems={[
            { key: 'wifi', label: 'Wi-Fi' },
            { key: 'netflix', label: 'Netflix' },
            { key: 'spotify', label: 'Spotify' },
            { key: 'youtube', label: 'YouTube Premium' },
            { key: 'phone', label: 'Data/Phone Bill' },
          ]}
          values={exp}
          onChange={updateExp}
        />
        <ExpenseCategoryCard
          storageKey="calc:transport"
          title="Transportation"
          accentColor="text-blue-400"
          icon={Car}
          initialItems={[
            { key: 'commute', label: 'Commute Money' },
            { key: 'gas', label: 'Gas' },
            { key: 'carAmort', label: 'Car Amortization' },
          ]}
          values={exp}
          onChange={updateExp}
        />
        <ExpenseCategoryCard
          storageKey="calc:obligations"
          title="Obligations"
          accentColor="text-purple-400"
          icon={ShieldCheck}
          initialItems={[
            { key: 'family', label: 'Money for Family' },
            { key: 'lifeIns', label: 'Life Insurance' },
            { key: 'carIns', label: 'Car Insurance' },
            { key: 'homeIns', label: 'Home Insurance' },
          ]}
          values={exp}
          onChange={updateExp}
        />
      </div>

      {/* MODALS */}
      <SavingsInfoModal isOpen={showSavingsInfo} onClose={() => setShowSavingsInfo(false)} />

      {showAddChild && (
        <Dialog title="Add a child" onClose={cancelAddChild}>
          <form onSubmit={addChild}>
            <label htmlFor="new-child-name" className="block text-sm font-bold text-zinc-600 dark:text-zinc-300">
              Name <span className="font-semibold text-zinc-400">(optional)</span>
            </label>
            <input
              id="new-child-name"
              autoFocus
              type="text"
              value={newChildName}
              onChange={(e) => setNewChildName(e.target.value)}
              placeholder={defaultChildName}
              maxLength={30}
              className="mt-2 w-full text-lg font-bold bg-transparent border-b-2 border-zinc-300 dark:border-zinc-700 focus:border-orange-400 pb-2 outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400 transition-colors"
            />
            <p className="mt-2 text-xs font-semibold text-zinc-400">
              Leave it blank and we&apos;ll call them &ldquo;{defaultChildName}&rdquo;. You can rename them anytime.
            </p>
            <div className="mt-8 flex gap-3">
              <button type="button" onClick={cancelAddChild} className={CANCEL_BTN}>Cancel</button>
              <button type="submit" className="flex-1 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-2xl shadow-lg transition-all">
                Add child
              </button>
            </div>
          </form>
        </Dialog>
      )}

      {childToRemove && (
        <Dialog title={`Remove ${childToRemove.name.trim() || 'this child'}?`} onClose={() => setChildToRemove(null)}>
          <p className="text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed text-sm md:text-base">
            Their expenses
            {childTotal(childToRemove) > 0 && (
              <> (<span className="font-bold text-zinc-900 dark:text-white">{peso(childTotal(childToRemove))}/mo</span>)</>
            )}{' '}
            will be taken out of your budget. This can&apos;t be undone.
          </p>
          <div className="mt-8 flex gap-3">
            <button type="button" autoFocus onClick={() => setChildToRemove(null)} className={CANCEL_BTN}>Keep</button>
            <button type="button" onClick={confirmRemoveChild} className="flex-1 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-2xl shadow-lg transition-all">
              Remove
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
}