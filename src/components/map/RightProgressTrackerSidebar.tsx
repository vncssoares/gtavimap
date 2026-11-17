'use client';

import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Star,
  Compass,
  FileText,
  Save,
  CheckCheck,
  X,
  MapPin,
  Share2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Language, MarkerLocation, UserProgress } from '@/types';
import { CATEGORIES } from '@/data/categories';
import { MarkerService } from '@/services/markerService';
import { getDictionary } from '@/i18n/translations';
import { EmbedSnippetButton } from '@/components/common/EmbedSnippetButton';

interface RightProgressTrackerSidebarProps {
  lang: Language;
  progress: UserProgress;
  allMarkers: MarkerLocation[];
  selectedMarker: MarkerLocation | null;
  onCloseMarkerDetails: () => void;
  onToggleFound: (markerId: string) => void;
  onToggleFavorite: (markerId: string) => void;
  onSaveNote: (markerId: string, note: string) => void;
}

export const RightProgressTrackerSidebar: React.FC<RightProgressTrackerSidebarProps> = ({
  lang,
  progress,
  allMarkers,
  selectedMarker,
  onCloseMarkerDetails,
  onToggleFound,
  onToggleFavorite,
  onSaveNote,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });
  const [noteText, setNoteText] = useState('');
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);
  const [showSpoiler, setShowSpoiler] = useState(false);
  const [prevMarkerId, setPrevMarkerId] = useState<string | null>(null);

  if (selectedMarker && selectedMarker.id !== prevMarkerId) {
    setPrevMarkerId(selectedMarker.id);
    setNoteText(progress.userNotes[selectedMarker.id] || '');
    setShowSpoiler(false);
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  } else if (!selectedMarker && prevMarkerId !== null) {
    setPrevMarkerId(null);
    setShowSpoiler(false);
  }

  const overallStats = MarkerService.getOverallStats(allMarkers, progress);

  const handleShare = async (marker: MarkerLocation) => {
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}/${lang.toLowerCase()}/map?m=${encodeURIComponent(marker.id)}`;
    const shareData = {
      title: `${marker.name} — GTAVIMap`,
      text: `${marker.name} (${marker.region}) — GTAVIMap`,
      url: shareUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: unknown) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } catch (err) {
        console.error('Failed to copy share link:', err);
      }
    }
  };

  const handleCopyCoords = (x: number, y: number) => {
    navigator.clipboard.writeText(`X: ${x}, Y: ${y}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const handleSaveNote = () => {
    if (!selectedMarker) return;
    onSaveNote(selectedMarker.id, noteText);
    setNoteSavedFeedback(true);
    setTimeout(() => setNoteSavedFeedback(false), 2000);
  };

  const markerCategory = selectedMarker
    ? CATEGORIES.find((c) => c.id === selectedMarker.category)
    : null;

  const dict = getDictionary(lang);

  return (
    <>
      {/* Botão de Aba Flutuante quando colapsada */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="absolute top-4 right-4 z-20 px-3 py-2 rounded-lg bg-[#12131a]/95 backdrop-blur-md border border-[#ff2a85] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-xl hover:bg-[#1a1c27] active:scale-95 transition-all"
        >
          <ChevronLeft size={16} className="text-[#ff2a85]" />
          <span className="hidden sm:inline font-mono">{dict.common.progress.toUpperCase()}</span>
          <span className="px-1.5 py-0.5 rounded bg-[#ff2a85] text-white text-[10px] font-bold">
            {overallStats.percentage}%
          </span>
        </button>
      )}

      <aside
        className={`fixed md:relative top-16 md:top-0 bottom-0 right-0 z-30 w-[290px] sm:w-[315px] max-w-[88vw] flex flex-col bg-[#12131a] border-l-2 border-[#ff2a85] text-slate-200 transition-all duration-300 shadow-2xl ${
          isCollapsed ? 'translate-x-full md:-mr-[315px]' : 'translate-x-0'
        }`}
        style={{
          boxShadow: '-4px 0 25px rgba(255, 42, 133, 0.15)',
        }}
      >
        {/* ================= TOPO DA BARRA DIREITA ================= */}
        <div className="p-4 border-b border-[#222433] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#ff2a85] font-mono text-sm font-black">›</span>
            <span className="text-sm font-black uppercase tracking-wider text-white">
              {dict.common.progressTracker}
            </span>
          </div>

          <button
            onClick={() => setIsCollapsed(true)}
            className="w-7 h-7 rounded-lg bg-[#1a1c27] border border-[#2d3042] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            title={dict.common.collapsePanel}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Conteúdo com Rolagem */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedMarker ? (
            <div className="space-y-3.5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-[#222433] pb-2.5">
                <span
                  className="text-xs font-mono font-black uppercase tracking-wider"
                  style={{ color: markerCategory?.color || '#00e5ff' }}
                >
                  {(markerCategory ? (dict.categories as Record<string, string>)[markerCategory.id] : null) || markerCategory?.shortLabel || selectedMarker.category}
                </span>
                <button
                  onClick={onCloseMarkerDetails}
                  className="text-slate-400 hover:text-white"
                  title={dict.common.closeDetails}
                >
                  <X size={18} />
                </button>
              </div>

              <div>
                <h3 className="text-base font-black text-white leading-snug">
                  {selectedMarker.spoiler && !showSpoiler
                    ? (markerCategory ? (dict.categories as Record<string, string>)[markerCategory.id] : null) || markerCategory?.shortLabel || selectedMarker.category
                    : selectedMarker.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <MapPin size={13} className="text-[#00e5ff]" />
                  <span>{selectedMarker.region}</span>
                </div>

                {selectedMarker.spoiler && !showSpoiler && (
                  <div className="mt-2.5 flex items-center justify-between p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono">
                      <EyeOff size={13} />
                      <span>Spoiler</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSpoiler(true)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] uppercase tracking-wider transition-colors"
                    >
                      <Eye size={11} />
                      <span>
                        {lang === 'pt-BR'
                          ? 'Mostrar spoiler'
                          : lang === 'es'
                          ? 'Mostrar spoiler'
                          : 'Show spoiler'}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Botão de Compartilhar (Ação Principal de Link) */}
              <button
                onClick={() => handleShare(selectedMarker)}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#ff2a85]/15 via-[#a855f7]/15 to-[#00e5ff]/15 border border-[#00e5ff]/40 hover:border-[#00e5ff] text-xs font-black uppercase tracking-wider text-white shadow-md hover:shadow-[#00e5ff]/20 active:scale-98 transition-all"
                title={dict.common.share}
              >
                <span className="flex items-center gap-2">
                  <Share2 size={15} className="text-[#00e5ff]" />
                  <span>{dict.common.share}</span>
                </span>
                {copiedLink ? (
                  <span className="text-[11px] font-mono text-[#00e5ff] font-bold flex items-center gap-1 animate-in fade-in">
                    <CheckCheck size={14} />
                    {dict.common.linkCopied}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-400 font-bold">LINK</span>
                )}
              </button>

              {/* Botão de Incorporar (Embed Snippet) */}
              <EmbedSnippetButton
                lang={lang}
                type="marker"
                id={selectedMarker.id}
              />

              {/* Botão de Coordenadas (Ação Secundária) */}
              <button
                onClick={() => handleCopyCoords(selectedMarker.x, selectedMarker.y)}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#090a0e] border border-[#252838] text-xs font-mono text-slate-300 hover:border-[#00e5ff] transition-colors"
              >
                <span className="flex items-center gap-1.5 text-[#00e5ff] font-bold">
                  <Compass size={14} />
                  <span>X: {selectedMarker.x} | Y: {selectedMarker.y}</span>
                </span>
                {copiedCoords ? (
                  <CheckCheck size={14} className="text-[#00e5ff]" />
                ) : (
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{dict.common.copy}</span>
                )}
              </button>

              {/* Botões de Ação Principal: Encontrado e Favorito */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => onToggleFound(selectedMarker.id)}
                  className={`py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                    progress.foundMarkerIds.includes(selectedMarker.id)
                      ? 'bg-[#00e5ff] text-black shadow-md shadow-[#00e5ff]/20'
                      : 'bg-[#1a1c27] text-white border border-[#2f3347] hover:border-[#00e5ff]'
                  }`}
                >
                  <Check size={15} strokeWidth={3} />
                  <span>
                    {progress.foundMarkerIds.includes(selectedMarker.id)
                      ? dict.common.markedFound.toUpperCase()
                      : dict.common.markFound.toUpperCase()}
                  </span>
                </button>

                <button
                  onClick={() => onToggleFavorite(selectedMarker.id)}
                  className={`py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                    progress.favoriteMarkerIds.includes(selectedMarker.id)
                      ? 'bg-[#fbbf24] text-black shadow-md shadow-[#fbbf24]/20'
                      : 'bg-[#1a1c27] text-white border border-[#2f3347] hover:border-[#fbbf24]'
                  }`}
                >
                  <Star
                    size={15}
                    className={
                      progress.favoriteMarkerIds.includes(selectedMarker.id)
                        ? 'fill-black'
                        : ''
                    }
                  />
                  <span>
                    {progress.favoriteMarkerIds.includes(selectedMarker.id)
                      ? dict.common.favorited.toUpperCase()
                      : dict.common.addFavorite.toUpperCase()}
                  </span>
                </button>
              </div>

              {/* Descrição com texto maior ou proteção de spoiler */}
              {selectedMarker.spoiler && !showSpoiler ? (
                <div className="p-3 rounded-xl bg-[#0b0c10] border border-amber-500/30 text-center space-y-2">
                  <p className="text-xs text-slate-400 italic">
                    {lang === 'pt-BR'
                      ? 'Descrição oculta para proteger revelações da história.'
                      : lang === 'es'
                      ? 'Descripción oculta para proteger detalles de la historia.'
                      : 'Description hidden to prevent story spoilers.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowSpoiler(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <Eye size={13} />
                    <span>
                      {lang === 'pt-BR'
                        ? 'Mostrar spoiler'
                        : lang === 'es'
                        ? 'Mostrar spoiler'
                        : 'Show spoiler'}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#0b0c10] border border-[#202230] text-xs text-slate-300 leading-relaxed">
                  {selectedMarker.description[lang] || selectedMarker.description.en}
                </div>
              )}

              {/* Anotações Pessoais */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 font-bold">
                    <FileText size={13} className="text-[#ff2a85]" />
                    <span>{dict.common.notes.toUpperCase()}</span>
                  </span>
                  {noteSavedFeedback && (
                    <span className="text-[#00e5ff] font-bold animate-pulse">{dict.common.saved}</span>
                  )}
                </div>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder={dict.common.notesPlaceholder}
                  rows={2}
                  className="w-full p-2.5 rounded-lg bg-[#090a0e] border border-[#222433] text-xs text-slate-200 focus:outline-none focus:border-[#ff2a85] resize-none"
                />
                <button
                  onClick={handleSaveNote}
                  className="w-full py-1.5 rounded-lg bg-[#1a1c27] hover:bg-[#252836] border border-[#2d3042] text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Save size={13} />
                  <span>{dict.common.saveNote.toUpperCase()}</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ================= BOTÕES PRINCIPAIS COM TEXTO GRANDE (LOGIN / REGISTER) ================= */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-[#ff2a85] to-[#f43f5e] shadow-lg shadow-[#ff2a85]/20 hover:opacity-95 transition-all"
                >
                  {dict.common.login.toUpperCase()}
                </button>
                <button
                  type="button"
                  className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-wider text-black bg-gradient-to-r from-[#00e5ff] to-[#38bdf8] shadow-lg shadow-[#00e5ff]/20 hover:opacity-95 transition-all"
                >
                  {dict.common.register.toUpperCase()}
                </button>
              </div>

              {/* Estatísticas de Progresso do Jogador com Letras Maiores */}
              <div className="p-3.5 rounded-xl bg-[#0a0b10] border border-[#202230] space-y-2.5 shadow-md">
                <div className="flex items-center justify-between text-xs font-black uppercase">
                  <span className="text-white">{dict.common.yourProgress.toUpperCase()}</span>
                  <span className="text-[#00e5ff] font-mono text-sm">{overallStats.percentage}%</span>
                </div>

                <div className="w-full h-2 rounded-full bg-[#181a24] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#ff2a85] to-[#00e5ff] rounded-full transition-all duration-300"
                    style={{ width: `${overallStats.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-300 font-bold">
                  <span>{overallStats.found} / {overallStats.total} {dict.common.markedFound.toUpperCase()}</span>
                  <span className="text-[#fbbf24]">★ {overallStats.favoritesCount}</span>
                </div>
              </div>

              {/* Lista de Features com tradução dinâmica */}
              <div className="text-xs text-slate-300 font-mono space-y-3.5 leading-normal border-t border-[#1e202d] pt-3.5">
                <div className="space-y-1.5">
                  <span className="text-white font-black block uppercase text-xs tracking-wider">
                    {dict.common.freeFeaturesTitle.toUpperCase()}
                  </span>
                  <p className="text-slate-300">{dict.common.freeFeature1}</p>
                  <p className="text-slate-300">{dict.common.freeFeature2}</p>
                  <p className="text-slate-300">{dict.common.freeFeature3}</p>
                </div>

                <div className="space-y-1.5 pt-1.5 border-t border-[#1e202d]">
                  <span className="text-[#00e5ff] font-black block uppercase text-xs tracking-wider">
                    {dict.common.proFeaturesTitle.toUpperCase()}
                  </span>
                  <p className="text-slate-300">{dict.common.proFeature1}</p>
                  <p className="text-slate-300">{dict.common.proFeature2}</p>
                  <p className="text-slate-300">{dict.common.proFeature3}</p>
                  <p className="text-[#ff2a85] font-black">{dict.common.proFeature4}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
};
