'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Sparkles,
} from 'lucide-react';
import { CategoryGroup, CategoryId, FilterStatus, Language, MarkerLocation, UserProgress } from '@/types';
import { CATEGORIES } from '@/data/categories';
import { getDictionary } from '@/i18n/translations';
import { DynamicIcon } from '@/components/common/DynamicIcon';
import { StorageService } from '@/services/storageService';
import { LanguageSelector } from '@/components/common/LanguageSelector';

interface CategoryFilterSidebarProps {
  lang: Language;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: CategoryId[];
  onToggleCategory: (catId: CategoryId) => void;
  onSelectAllCategories: () => void;
  onClearCategories: () => void;
  filterStatus: FilterStatus;
  onFilterStatusChange: (status: FilterStatus) => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  allMarkers: MarkerLocation[];
  progress: UserProgress;
  onResetProgress: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const CategoryFilterSidebar: React.FC<CategoryFilterSidebarProps> = ({
  lang,
  searchQuery,
  onSearchChange,
  selectedCategories,
  onToggleCategory,
  onSelectAllCategories,
  onClearCategories,
  filterStatus,
  onFilterStatusChange,
  allMarkers,
  onResetProgress,
  isOpenMobile,
  onCloseMobile,
}) => {
  const dict = getDictionary(lang);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backupJsonText, setBackupJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const groups: CategoryGroup[] = ['COLLECTIBLES', 'ACTIVITIES', 'SERVICES', 'LOCATIONS', 'WEAPONS'];

  const handleExportBackup = () => {
    const json = StorageService.exportBackupJson();
    setBackupJsonText(json);
    setShowBackupModal(true);
    setImportStatus('idle');
  };

  const handleImportBackup = () => {
    if (!backupJsonText.trim()) return;
    const success = StorageService.importBackupJson(backupJsonText);
    if (success) {
      setImportStatus('success');
      setTimeout(() => setShowBackupModal(false), 1500);
    } else {
      setImportStatus('error');
    }
  };

  return (
    <>
      {/* Botão flutuante para reabrir a sidebar quando colapsada */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="hidden md:flex absolute top-3 left-3 z-30 w-9 h-9 rounded-lg bg-[#12131a] border border-[#ff2a85] text-[#ff2a85] items-center justify-center shadow-xl hover:bg-[#1a1c27] transition-all"
          title="Expandir Painel"
        >
          <ChevronRight size={20} />
        </button>
      )}

      <aside
        className={`fixed md:relative top-0 bottom-0 left-0 z-30 w-[360px] sm:w-[380px] max-w-[92vw] flex flex-col bg-[#12131a] border-r-2 border-[#ff2a85] text-slate-200 transition-all duration-300 shadow-2xl ${
          isCollapsed ? '-translate-x-full md:-ml-[380px]' : 'translate-x-0'
        } ${isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={{
          boxShadow: '4px 0 25px rgba(255, 42, 133, 0.15)',
        }}
      >
        {/* ================= CABEÇALHO ESQUERDO ESTILO HUD ================= */}
        <div className="p-4 border-b border-[#222433] bg-[#12131a] relative space-y-3">
          {/* Botão de Colapsar no topo direito */}
          <button
            onClick={() => setIsCollapsed(true)}
            className="hidden md:flex absolute top-3.5 right-3.5 w-7 h-7 rounded-lg bg-[#1a1c27] border border-[#2d3042] text-slate-400 hover:text-white items-center justify-center transition-colors"
            title="Recolher Barra"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Botão Fechar no Mobile */}
          <button
            onClick={onCloseMobile}
            className="md:hidden absolute top-3.5 right-3.5 w-8 h-8 rounded-lg bg-[#1a1c27] border border-[#ff2a85] text-[#ff2a85] flex items-center justify-center"
            aria-label="Close filters"
          >
            <X size={18} />
          </button>

          {/* Logo e Título VI GTA VI INTERACTIVE MAP */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center font-black text-3xl tracking-tighter">
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#ff2a85] via-[#a855f7] to-[#00e5ff]">
                VI
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black uppercase tracking-wider text-white">
                GTA VI INTERACTIVE MAP
              </span>
            </div>
          </div>

          {/* Logo gtavimap neon vibrante */}
          <div>
            <Link
              href={`/${lang.toLowerCase()}`}
              className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a85] via-[#ec4899] to-[#00e5ff] hover:opacity-90 transition-opacity inline-block"
              style={{
                textShadow: '0 0 18px rgba(255, 42, 133, 0.35)',
              }}
            >
              gtavimap
            </Link>
          </div>

          {/* Ícones de Redes Sociais & Seletor de Idioma */}
          <div className="flex items-center gap-2 text-slate-300">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-6 h-6 rounded bg-[#1d4ed8] text-white flex items-center justify-center text-xs font-bold hover:scale-110 transition-transform"
            >
              f
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-6 h-6 rounded bg-gradient-to-tr from-[#f59e0b] via-[#ec4899] to-[#8b5cf6] text-white flex items-center justify-center text-xs font-bold hover:scale-110 transition-transform"
            >
              ig
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="w-6 h-6 rounded bg-[#ef4444] text-white flex items-center justify-center text-xs font-bold hover:scale-110 transition-transform"
            >
              yt
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="w-6 h-6 rounded bg-[#0284c7] text-white flex items-center justify-center text-xs font-bold hover:scale-110 transition-transform"
            >
              tw
            </a>
            <a
              href="https://twitch.tv"
              target="_blank"
              rel="noreferrer"
              className="w-6 h-6 rounded bg-[#9333ea] text-white flex items-center justify-center text-xs font-bold hover:scale-110 transition-transform"
            >
              tv
            </a>
            <a
              href="https://telegram.org"
              target="_blank"
              rel="noreferrer"
              className="w-6 h-6 rounded bg-[#0ea5e9] text-white flex items-center justify-center text-xs font-bold hover:scale-110 transition-transform"
            >
              tg
            </a>

            <div className="ml-auto">
              <LanguageSelector currentLang={lang} />
            </div>
          </div>

          {/* Botões superiores em estilo pílula / contorno com texto aumentado */}
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            <button
              onClick={onSelectAllCategories}
              className="px-3 py-1.5 rounded-full border border-[#00e5ff] text-[#00e5ff] hover:bg-[#00e5ff]/10 text-xs font-black uppercase tracking-wider transition-colors"
            >
              SHOW ALL
            </button>
            <button
              onClick={onClearCategories}
              className="px-3 py-1.5 rounded-full border border-slate-600 text-slate-200 hover:bg-slate-800 text-xs font-black uppercase tracking-wider transition-colors"
            >
              HIDE ALL
            </button>
            <button
              onClick={() => onFilterStatusChange(filterStatus === 'favorites' ? 'all' : 'favorites')}
              className={`px-3 py-1.5 rounded-full border text-xs font-black uppercase tracking-wider transition-colors ${
                filterStatus === 'favorites'
                  ? 'border-[#fbbf24] bg-[#fbbf24]/20 text-[#fbbf24]'
                  : 'border-slate-600 text-slate-200 hover:border-[#fbbf24]'
              }`}
            >
              FAVORITES
            </button>
            <button
              onClick={() => onFilterStatusChange(filterStatus === 'found' ? 'all' : 'found')}
              className={`px-3 py-1.5 rounded-full border text-xs font-black uppercase tracking-wider transition-colors ${
                filterStatus === 'found'
                  ? 'border-[#00ff66] bg-[#00ff66]/20 text-[#00ff66]'
                  : 'border-slate-600 text-slate-200 hover:border-[#00ff66]'
              }`}
            >
              FOUND
            </button>
          </div>

          {/* Campo de Busca com Botão SEARCH integrado com texto maior */}
          <div className="flex items-center gap-2 pt-1">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search... e.g. 'Stunt Jump' or 'Weapon'"
                className="w-full px-3 py-2 rounded-lg bg-[#0b0c10] border border-[#262838] text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#ff2a85] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              type="button"
              className="px-3.5 py-2 rounded-lg bg-[#161722] border border-[#ff2a85] text-[#ff2a85] hover:bg-[#ff2a85] hover:text-black font-black text-xs uppercase tracking-wider transition-all"
            >
              SEARCH
            </button>
          </div>
        </div>

        {/* ================= GRID DE CATEGORIAS (2 COLUNAS) COM LETRAS AUMENTADAS ================= */}
        <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-4">
          {groups.map((groupName) => {
            const groupCategories = CATEGORIES.filter((c) => c.group === groupName);
            if (groupCategories.length === 0) return null;

            return (
              <div key={groupName} className="space-y-2">
                {/* Título da Seção aumentado e nítido */}
                <h4 className="text-xs font-black tracking-wider text-slate-200 uppercase px-1">
                  {groupName}
                </h4>

                {/* Grid de 2 Colunas */}
                <div className="grid grid-cols-2 gap-2">
                  {groupCategories.map((cat) => {
                    const isChecked = selectedCategories.includes(cat.id);
                    const catMarkers = allMarkers.filter((m) => m.category === cat.id);
                    const total = catMarkers.length;

                    return (
                      <button
                        key={cat.id}
                        onClick={() => onToggleCategory(cat.id)}
                        className={`flex items-center justify-between p-2 rounded-lg font-bold tracking-tight transition-all border ${
                          isChecked
                            ? 'bg-[#181a24] border-[#2d3042] text-white hover:border-[#41455e]'
                            : 'bg-[#0e0f14]/80 border-transparent text-slate-500 hover:text-slate-400 opacity-40'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <DynamicIcon
                            name={cat.iconName}
                            size={14}
                            color={isChecked ? cat.color : '#64748b'}
                            className="shrink-0"
                          />
                          <span className="truncate uppercase font-mono text-[11px] sm:text-xs">
                            {cat.shortLabel}
                          </span>
                        </div>

                        {/* Badge numérico com tamanho maior e visível */}
                        <span
                          className="px-1.5 py-0.5 rounded text-[10.5px] font-mono font-bold shrink-0 ml-1.5"
                          style={{
                            color: isChecked ? cat.color : '#64748b',
                            backgroundColor: isChecked ? cat.badgeBg : '#12131a',
                          }}
                        >
                          {total}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= BASE DA SIDEBAR ESQUERDA ================= */}
        <div className="p-3.5 border-t border-[#222433] bg-[#0e0f15] space-y-2.5">
          {/* Botão UPGRADE TO PRO com tamanho confortável */}
          <Link
            href={`/${lang.toLowerCase()}/premium`}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm uppercase tracking-wider text-[#0e0f15] bg-gradient-to-r from-[#ff2a85] via-[#a855f7] to-[#00e5ff] hover:opacity-95 transition-transform transform active:scale-98 shadow-lg shadow-[#ff2a85]/25"
          >
            <Sparkles size={16} className="text-[#0e0f15]" />
            <span>UPGRADE TO PRO</span>
          </Link>

          {/* Links utilitários */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
            <button
              onClick={handleExportBackup}
              className="hover:text-[#00e5ff] transition-colors flex items-center gap-1.5"
            >
              <Download size={13} />
              <span>Backup / Restore JSON</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Deseja redefinir todo o progresso do mapa?')) {
                  onResetProgress();
                }
              }}
              className="hover:text-red-400 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </aside>

      {/* Modal de Backup / Importação de Progresso */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#12131a] border border-[#ff2a85] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222433] pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Download size={16} className="text-[#00e5ff]" />
                Backup & Restore Progress
              </h3>
              <button onClick={() => setShowBackupModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <textarea
              value={backupJsonText}
              onChange={(e) => setBackupJsonText(e.target.value)}
              rows={8}
              className="w-full p-3 rounded-xl bg-[#090a0e] border border-[#262838] font-mono text-xs text-slate-200 focus:outline-none focus:border-[#ff2a85]"
            />

            {importStatus === 'success' && (
              <div className="p-2 rounded-lg bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] text-xs text-center font-bold">
                ✓ Sucesso!
              </div>
            )}
            {importStatus === 'error' && (
              <div className="p-2 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs text-center">
                ⚠ Formato JSON inválido.
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(backupJsonText);
                  alert('Copiado!');
                }}
                className="px-4 py-2 rounded-lg bg-[#1a1c27] text-slate-200 text-xs font-bold"
              >
                Copiar
              </button>
              <button
                onClick={handleImportBackup}
                className="px-4 py-2 rounded-lg bg-[#00e5ff] text-black text-xs font-black uppercase"
              >
                Importar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop para mobile */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}
    </>
  );
};
