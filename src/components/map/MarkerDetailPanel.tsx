'use client';

import React, { useState } from 'react';
import {
  X,
  Check,
  Star,
  MapPin,
  Clock,
  Award,
  Tag,
  Copy,
  CheckCheck,
  AlertTriangle,
  FileText,
  Save,
  Compass,
  Share2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { MarkerLocation, Language } from '@/types';
import { CATEGORIES } from '@/data/categories';
import { getDictionary } from '@/i18n/translations';
import { DynamicIcon } from '@/components/common/DynamicIcon';
import { EmbedSnippetButton } from '@/components/common/EmbedSnippetButton';

interface MarkerDetailPanelProps {
  marker: MarkerLocation | null;
  onClose: () => void;
  lang: Language;
  isFound: boolean;
  isFavorite: boolean;
  userNote?: string;
  onToggleFound: (markerId: string) => void;
  onToggleFavorite: (markerId: string) => void;
  onSaveNote: (markerId: string, note: string) => void;
}

export const MarkerDetailPanel: React.FC<MarkerDetailPanelProps> = ({
  marker,
  onClose,
  lang,
  isFound,
  isFavorite,
  userNote = '',
  onToggleFound,
  onToggleFavorite,
  onSaveNote,
}) => {
  const [noteText, setNoteText] = useState(userNote);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);
  const [showSpoiler, setShowSpoiler] = useState(false);
  const [prevMarkerId, setPrevMarkerId] = useState(marker?.id);
  const [prevUserNote, setPrevUserNote] = useState(userNote);

  if (marker?.id !== prevMarkerId || userNote !== prevUserNote) {
    setPrevMarkerId(marker?.id);
    setPrevUserNote(userNote);
    setNoteText(userNote);
    setShowSpoiler(false);
  }

  if (!marker) return null;

  const dict = getDictionary(lang);
  const category = CATEGORIES.find((c) => c.id === marker.category);
  const descriptionText = marker.description[lang] || marker.description.en;

  const handleShare = async () => {
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

  const handleCopyCoords = () => {
    const coordsString = `X: ${marker.x}, Y: ${marker.y}`;
    navigator.clipboard.writeText(coordsString);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const handleSaveNote = () => {
    onSaveNote(marker.id, noteText);
    setNoteSavedFeedback(true);
    setTimeout(() => setNoteSavedFeedback(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1624] text-slate-100 border-l border-[#1d2d42] shadow-2xl overflow-y-auto">
      {/* Header com Categoria e Botão Fechar */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#0d1624]/95 backdrop-blur-md border-b border-[#1b2b3e]">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md"
            style={{ backgroundColor: category?.badgeBg || 'rgba(0,229,255,0.1)' }}
          >
            <DynamicIcon
              name={category?.iconName || 'MapPin'}
              size={18}
              color={category?.color || '#00e5ff'}
            />
          </div>
          <div>
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: category?.color || '#00e5ff' }}
            >
              {category ? (dict.categories as Record<string, string>)[category.id] || category.shortLabel : marker.category}
            </span>
            {marker.subCategory && (
              <span className="block text-[10px] text-slate-400 font-mono">
                {marker.subCategory}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a293d] transition-colors"
          aria-label="Close details"
        >
          <X size={18} />
        </button>
      </div>

      {/* Conteúdo Principal */}
      <div className="p-4 sm:p-5 space-y-5 flex-1">
        {/* Título e Região */}
        <div>
          <h2 className="text-xl font-black text-white tracking-tight leading-snug">
            {marker.spoiler && !showSpoiler
              ? category
                ? (dict.categories as Record<string, string>)[category.id] || category.shortLabel
                : marker.category
              : marker.name}
          </h2>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
            <MapPin size={14} className="text-[#00e5ff]" />
            <span className="font-medium text-slate-300">{marker.region}</span>
          </div>

          {marker.spoiler && !showSpoiler && (
            <div className="mt-2.5 flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono">
                <EyeOff size={14} />
                <span>Spoiler da História</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSpoiler(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-black text-[11px] uppercase tracking-wider transition-colors"
              >
                <Eye size={12} />
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

        {/* Compartilhar (Ação Principal de Link) */}
        <button
          onClick={handleShare}
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

        {/* Incorporar (Embed Snippet) */}
        <EmbedSnippetButton
          lang={lang}
          type="marker"
          id={marker.id}
        />

        {/* Coordenadas e Alerta de Demonstração (Ação Secundária) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyCoords}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#131f30] hover:bg-[#1a2b42] border border-[#22354e] text-[11px] font-mono text-slate-300 transition-colors"
            title="Copiar Coordenadas"
          >
            <Compass size={13} className="text-[#00e5ff]" />
            <span>X: {marker.x} | Y: {marker.y}</span>
            {copiedCoords ? (
              <CheckCheck size={13} className="text-[#00e5ff]" />
            ) : (
              <Copy size={13} className="text-slate-400" />
            )}
          </button>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[10px] font-mono text-[#f59e0b]">
            <AlertTriangle size={12} />
            <span>Demonstração Fictícia</span>
          </span>
        </div>

        {/* Botões de Ação Principal (Encontrado & Favorito) */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={() => onToggleFound(marker.id)}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md ${
              isFound
                ? 'bg-[#00e5ff] text-[#080d14] hover:bg-[#38bdf8]'
                : 'bg-[#152336] text-slate-300 hover:bg-[#1c304a] hover:text-white border border-[#233852]'
            }`}
          >
            <Check size={16} className={isFound ? 'stroke-[3]' : ''} />
            <span>{isFound ? dict.common.markedFound : dict.common.markFound}</span>
          </button>

          <button
            onClick={() => onToggleFavorite(marker.id)}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md ${
              isFavorite
                ? 'bg-[#fbbf24] text-[#080d14] hover:bg-[#f59e0b]'
                : 'bg-[#152336] text-slate-300 hover:bg-[#1c304a] hover:text-white border border-[#233852]'
            }`}
          >
            <Star size={16} className={isFavorite ? 'fill-[#080d14] stroke-[2]' : ''} />
            <span>{isFavorite ? dict.common.favorited : dict.common.addFavorite}</span>
          </button>
        </div>

        {/* Descrição do Local */}
        <div className="p-3.5 rounded-xl bg-[#111c2c] border border-[#1d2d42] space-y-1.5">
          <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Descrição</span>
            {marker.spoiler && showSpoiler && (
              <span className="text-amber-400 text-[10px] font-mono">Spoiler Revelado</span>
            )}
          </h4>
          {marker.spoiler && !showSpoiler ? (
            <div className="py-2 text-center space-y-2">
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
            <p className="text-xs text-slate-200 leading-relaxed">{descriptionText}</p>
          )}
        </div>

        {/* Informações Extras (Horário, Recompensa) */}
        {(marker.recommendedTime || marker.reward) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {marker.recommendedTime && (
              <div className="p-2.5 rounded-lg bg-[#111c2c] border border-[#1b2b3f] flex items-start gap-2">
                <Clock size={15} className="text-[#38bdf8] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-mono">
                    Horário Ideal
                  </span>
                  <span className="font-medium text-slate-200">{marker.recommendedTime}</span>
                </div>
              </div>
            )}
            {marker.reward && (
              <div className="p-2.5 rounded-lg bg-[#111c2c] border border-[#1b2b3f] flex items-start gap-2">
                <Award size={15} className="text-[#fbbf24] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-mono">
                    Recompensa
                  </span>
                  <span className="font-medium text-slate-200">{marker.reward}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {marker.tags && marker.tags.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Tag size={12} />
              Tags
            </span>
            <div className="flex flex-wrap gap-1.5">
              {marker.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-[#132032] border border-[#20334d] text-[10px] text-slate-300 font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Anotações Pessoais do Usuário (Persistidas no LocalStorage) */}
        <div className="p-3.5 rounded-xl bg-[#0f1826] border border-[#1d2d42] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <FileText size={14} className="text-[#00e5ff]" />
              {dict.common.notes}
            </span>
            {noteSavedFeedback && (
              <span className="text-[10px] font-mono text-[#00e5ff] flex items-center gap-1 animate-pulse">
                <Check size={12} /> Salvo!
              </span>
            )}
          </div>

          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder={dict.common.notesPlaceholder}
            rows={3}
            className="w-full p-2.5 rounded-lg bg-[#0a101a] border border-[#1f2f45] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00e5ff] transition-colors resize-none"
          />

          <button
            onClick={handleSaveNote}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[#17263b] hover:bg-[#1e324d] text-slate-200 text-xs font-semibold border border-[#253b59] transition-colors"
          >
            <Save size={13} />
            <span>{dict.common.saveNote}</span>
          </button>
        </div>

        {/* Fonte dos Dados */}
        <div className="pt-2 border-t border-[#162335] text-[10px] text-slate-500 font-mono leading-tight">
          <span className="text-slate-400 font-semibold">{dict.common.source}:</span> {marker.source}
        </div>
      </div>
    </div>
  );
};
