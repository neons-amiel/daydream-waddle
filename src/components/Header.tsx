'use client'

import React, { useState } from 'react';

export default function Header() {
  return (
    <header className="flex flex-row w-full items-center justify-between p-4 bg-white dark:bg-zinc-900 border-b">
      <div>
        <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
      </div>
      <nav>
        <ul className="flex flex-row gap-6 text-sm font-medium">
          <li className="cursor-pointer hover:underline">I'm an adult</li>
          <li className="cursor-pointer hover:underline">I'm a student</li>
          <li className="cursor-pointer hover:underline">I'm a parent</li>
          <li className="cursor-pointer hover:underline">Custom</li>
        </ul>
      </nav>
      <div>
        <h1 className="text-base font-semibold rounded-md border-2 p-2 hover:-translate-x-0.5">Visit WaddlePH!</h1>
      </div>
    </header>
  );
}