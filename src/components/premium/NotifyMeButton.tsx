'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface NotifyMeButtonProps {
  label: string;
}

export const NotifyMeButton: React.FC<NotifyMeButtonProps> = ({ label }) => {
  return (
    <button
      type="button"
      disabled
      className="inline-flex items-center gap-2 px-8 py-3.5 min-h-[44px] rounded-xl bg-[#222433] text-slate-300 border border-[#383d54] font-black text-xs uppercase tracking-wider shadow-lg cursor-not-allowed opacity-90"
    >
      <Sparkles size={16} className="text-[#ff2a85]" />
      <span>{label}</span>
    </button>
  );
};
