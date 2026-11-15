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
      onClick={() => {
        alert(
          'Obrigado pelo interesse! Seu email fictício foi registrado para receber notificações quando o serviço for lançado junto ao GTA VI.'
        );
      }}
      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#fbbf24] hover:bg-[#f59e0b] text-[#070b12] font-black text-xs uppercase tracking-wider transition-all transform hover:-translate-y-0.5 shadow-xl shadow-[#fbbf24]/20 cursor-pointer"
    >
      <Sparkles size={16} />
      <span>{label}</span>
    </button>
  );
};
