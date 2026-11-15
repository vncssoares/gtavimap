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
} from 'lucide-react';
import { Language, MarkerLocation, UserProgress } from '@/types';
import { CATEGORIES } from '@/data/categories';
import { MarkerService } from '@/services/markerService';

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);

  const overallStats = MarkerService.getOverallStats(allMarkers, progress);

  React.useEffect(() => {
    if (selectedMarker) {
      setNoteText(progress.userNotes[selectedMarker.id] || '');
      setIsCollapsed(false);
    }
  }, [selectedMarker, progress.userNotes]);

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

  return (
    <>
      {/* Botão de Aba Flutuante quando colapsada */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="hidden md:flex absolute top-3 right-3 z-30 px-3.5 py-2 rounded-xl bg-[#12131a] border border-[#ff2a85] text-white text-xs font-black uppercase tracking-wider items-center gap-2 shadow-xl hover:bg-[#1a1c27] transition-all"
        >
          <ChevronLeft size={16} className="text-[#ff2a85]" />
          <span>PROGRES TRACKER</span>
        </button>
      )}

      <aside
        className={`fixed md:relative top-0 bottom-0 right-0 z-30 w-[290px] sm:w-[315px] max-w-[88vw] flex flex-col bg-[#12131a] border-l-2 border-[#ff2a85] text-slate-200 transition-all duration-300 shadow-2xl ${
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
              PROGRES TRACKER
            </span>
          </div>

          <button
            onClick={() => setIsCollapsed(true)}
            className="w-7 h-7 rounded-lg bg-[#1a1c27] border border-[#2d3042] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            title="Recolher Painel"
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
                  {markerCategory?.shortLabel || selectedMarker.category}
                </span>
                <button
                  onClick={onCloseMarkerDetails}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div>
                <h3 className="text-base font-black text-white leading-snug">
                  {selectedMarker.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <MapPin size={13} className="text-[#00e5ff]" />
                  <span>{selectedMarker.region}</span>
                </div>
              </div>

              {/* Botão de Coordenadas */}
              <button
                onClick={() => handleCopyCoords(selectedMarker.x, selectedMarker.y)}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#090a0e] border border-[#252838] text-xs font-mono text-slate-300 hover:border-[#00e5ff] transition-colors"
              >
                <span className="flex items-center gap-1.5 text-[#00e5ff] font-bold">
                  <Compass size={14} />
                  <span>X: {selectedMarker.x} | Y: {selectedMarker.y}</span>
                </span>
                {copiedCoords ? (
                  <CheckCheck size={14} className="text-[#00ff66]" />
                ) : (
                  <span className="text-[10px] text-slate-500 font-bold uppercase">COPIAR</span>
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
                      ? 'FOUND'
                      : 'MARK FOUND'}
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
                  <span>FAV</span>
                </button>
              </div>

              {/* Descrição com texto maior */}
              <div className="p-3 rounded-xl bg-[#0b0c10] border border-[#202230] text-xs text-slate-300 leading-relaxed">
                {selectedMarker.description[lang] || selectedMarker.description.en}
              </div>

              {/* Anotações Pessoais */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 font-bold">
                    <FileText size={13} className="text-[#ff2a85]" />
                    <span>NOTAS PRIVADAS</span>
                  </span>
                  {noteSavedFeedback && (
                    <span className="text-[#00ff66] font-bold animate-pulse">Salvo!</span>
                  )}
                </div>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Escreva suas observações..."
                  rows={2}
                  className="w-full p-2.5 rounded-lg bg-[#090a0e] border border-[#222433] text-xs text-slate-200 focus:outline-none focus:border-[#ff2a85] resize-none"
                />
                <button
                  onClick={handleSaveNote}
                  className="w-full py-1.5 rounded-lg bg-[#1a1c27] hover:bg-[#252836] border border-[#2d3042] text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Save size={13} />
                  <span>SALVAR NOTA</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ================= BOTÕES PRINCIPAIS COM TEXTO GRANDE (LOGIN / REGISTER) ================= */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => alert('Sistema de Login/Conta na Nuvem (Planejado para versão final).')}
                  className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-[#ff2a85] to-[#f43f5e] shadow-lg shadow-[#ff2a85]/20 hover:opacity-95 transition-all"
                >
                  LOGIN
                </button>
                <button
                  type="button"
                  onClick={() => alert('Sistema de Registro/Conta na Nuvem (Planejado para versão final).')}
                  className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-wider text-black bg-gradient-to-r from-[#00e5ff] to-[#38bdf8] shadow-lg shadow-[#00e5ff]/20 hover:opacity-95 transition-all"
                >
                  REGISTER
                </button>
              </div>

              {/* Estatísticas de Progresso do Jogador com Letras Maiores */}
              <div className="p-3.5 rounded-xl bg-[#0a0b10] border border-[#202230] space-y-2.5 shadow-md">
                <div className="flex items-center justify-between text-xs font-black uppercase">
                  <span className="text-white">SEU PROGRESSO</span>
                  <span className="text-[#00e5ff] font-mono text-sm">{overallStats.percentage}%</span>
                </div>

                <div className="w-full h-2 rounded-full bg-[#181a24] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#ff2a85] to-[#00e5ff] rounded-full transition-all duration-300"
                    style={{ width: `${overallStats.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-300 font-bold">
                  <span>{overallStats.found} / {overallStats.total} ENCONTRADOS</span>
                  <span className="text-[#fbbf24]">★ {overallStats.favoritesCount}</span>
                </div>
              </div>

              {/* Lista de Features no Estilo da Imagem com Texto Aumentado e Nítido */}
              <div className="text-xs text-slate-300 font-mono space-y-3.5 leading-normal border-t border-[#1e202d] pt-3.5">
                <div className="space-y-1.5">
                  <span className="text-white font-black block uppercase text-xs tracking-wider">
                    FEATURES:
                  </span>
                  <p className="text-slate-300">• Mark locations as found</p>
                  <p className="text-slate-300">• Track your collectibles</p>
                  <p className="text-slate-300">• Add custom locations</p>
                </div>

                <div className="space-y-1.5 pt-1.5 border-t border-[#1e202d]">
                  <span className="text-[#00e5ff] font-black block uppercase text-xs tracking-wider">
                    PRO FEATURES:
                  </span>
                  <p className="text-slate-300">• Share your custom locations with friends</p>
                  <p className="text-slate-300">• Unlimited progress tracking</p>
                  <p className="text-slate-300">• Map profiles for multiple playthroughs</p>
                  <p className="text-[#ff2a85] font-black">• No more ads!</p>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
};
