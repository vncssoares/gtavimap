'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { Language } from '@/types';
import { LAUNCH_AT_ISO, COUNTDOWN_LABELS } from '@/data/gameInfo';

interface LaunchCountdownProps {
  lang: Language;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLaunched: boolean;
}

function calculateTimeLeft(): TimeLeft {
  const targetTime = new Date(LAUNCH_AT_ISO).getTime();
  const now = Date.now();
  const diff = targetTime - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLaunched: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isLaunched: false };
}

const emptySubscribe = () => () => {};

export const LaunchCountdownFallback: React.FC<LaunchCountdownProps> = ({ lang }) => {
  const labels = COUNTDOWN_LABELS[lang] || COUNTDOWN_LABELS.en;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-5 rounded-2xl bg-[#0e1017] border border-[#222538] shadow-xl text-center space-y-3">
      <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-[#38f8ff]">
        <Clock size={14} className="animate-pulse" />
        <span>{labels.expectedLaunch}</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl mx-auto">
        <div className="p-3 sm:p-4 rounded-xl bg-[#141622] border border-[#23273c] flex flex-col items-center">
          <span className="text-2xl sm:text-4xl font-black font-mono tabular-nums text-white tracking-tight">
            --
          </span>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-300 mt-1">
            {labels.days}
          </span>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-[#141622] border border-[#23273c] flex flex-col items-center">
          <span className="text-2xl sm:text-4xl font-black font-mono tabular-nums text-white tracking-tight">
            --
          </span>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-300 mt-1">
            {labels.hours}
          </span>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-[#141622] border border-[#23273c] flex flex-col items-center">
          <span className="text-2xl sm:text-4xl font-black font-mono tabular-nums text-white tracking-tight">
            --
          </span>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-300 mt-1">
            {labels.minutes}
          </span>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-[#141622] border border-[#23273c] flex flex-col items-center">
          <span className="text-2xl sm:text-4xl font-black font-mono tabular-nums text-[#ff2a85] tracking-tight">
            --
          </span>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-300 mt-1">
            {labels.seconds}
          </span>
        </div>
      </div>
    </div>
  );
};

export const LaunchCountdown: React.FC<LaunchCountdownProps> = ({ lang }) => {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft());

  const labels = COUNTDOWN_LABELS[lang] || COUNTDOWN_LABELS.en;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-5 rounded-2xl bg-[#0e1017] border border-[#222538] shadow-xl text-center space-y-3">
      <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-[#38f8ff]">
        <Clock size={14} className="animate-pulse" />
        <span>{labels.expectedLaunch}</span>
      </div>

      {isClient && timeLeft.isLaunched ? (
        <div className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#10b981]/20 via-[#00e5ff]/20 to-[#ff2a85]/20 border border-[#10b981]/50 flex items-center justify-center gap-3">
          <CheckCircle className="text-[#10b981]" size={22} />
          <span className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
            {labels.availableNow}
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl mx-auto">
          {/* Dias */}
          <div className="p-3 sm:p-4 rounded-xl bg-[#141622] border border-[#23273c] flex flex-col items-center">
            <span className="text-2xl sm:text-4xl font-black font-mono tabular-nums text-white tracking-tight">
              {isClient ? String(timeLeft.days).padStart(2, '0') : '--'}
            </span>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-300 mt-1">
              {labels.days}
            </span>
          </div>

          {/* Horas */}
          <div className="p-3 sm:p-4 rounded-xl bg-[#141622] border border-[#23273c] flex flex-col items-center">
            <span className="text-2xl sm:text-4xl font-black font-mono tabular-nums text-white tracking-tight">
              {isClient ? String(timeLeft.hours).padStart(2, '0') : '--'}
            </span>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-300 mt-1">
              {labels.hours}
            </span>
          </div>

          {/* Minutos */}
          <div className="p-3 sm:p-4 rounded-xl bg-[#141622] border border-[#23273c] flex flex-col items-center">
            <span className="text-2xl sm:text-4xl font-black font-mono tabular-nums text-white tracking-tight">
              {isClient ? String(timeLeft.minutes).padStart(2, '0') : '--'}
            </span>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-300 mt-1">
              {labels.minutes}
            </span>
          </div>

          {/* Segundos */}
          <div className="p-3 sm:p-4 rounded-xl bg-[#141622] border border-[#23273c] flex flex-col items-center">
            <span className="text-2xl sm:text-4xl font-black font-mono tabular-nums text-[#ff2a85] tracking-tight">
              {isClient ? String(timeLeft.seconds).padStart(2, '0') : '--'}
            </span>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-300 mt-1">
              {labels.seconds}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
