import { UserProgress } from '@/types';

const STORAGE_KEY = 'gtavimap_user_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  foundMarkerIds: [],
  favoriteMarkerIds: [],
  userNotes: {},
  updatedAt: new Date().toISOString(),
};

export const StorageService = {
  getProgress(): UserProgress {
    if (typeof window === 'undefined') return DEFAULT_PROGRESS;

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return DEFAULT_PROGRESS;
      const parsed = JSON.parse(data);
      return {
        foundMarkerIds: Array.isArray(parsed.foundMarkerIds) ? parsed.foundMarkerIds : [],
        favoriteMarkerIds: Array.isArray(parsed.favoriteMarkerIds) ? parsed.favoriteMarkerIds : [],
        userNotes: typeof parsed.userNotes === 'object' && parsed.userNotes !== null ? parsed.userNotes : {},
        updatedAt: parsed.updatedAt || new Date().toISOString(),
      };
    } catch (e) {
      console.error('Falha ao ler progresso do localStorage:', e);
      return DEFAULT_PROGRESS;
    }
  },

  saveProgress(progress: Partial<UserProgress>): UserProgress {
    if (typeof window === 'undefined') return DEFAULT_PROGRESS;

    try {
      const current = this.getProgress();
      const updated: UserProgress = {
        ...current,
        ...progress,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      // Dispara evento customizado para componentes escutarem no mesmo documento
      window.dispatchEvent(new CustomEvent('gtavimap_progress_updated', { detail: updated }));
      return updated;
    } catch (e) {
      console.error('Falha ao salvar progresso no localStorage:', e);
      return DEFAULT_PROGRESS;
    }
  },

  toggleFound(markerId: string): boolean {
    const current = this.getProgress();
    const isFound = current.foundMarkerIds.includes(markerId);
    const newFound = isFound
      ? current.foundMarkerIds.filter((id) => id !== markerId)
      : [...current.foundMarkerIds, markerId];

    this.saveProgress({ foundMarkerIds: newFound });
    return !isFound;
  },

  toggleFavorite(markerId: string): boolean {
    const current = this.getProgress();
    const isFav = current.favoriteMarkerIds.includes(markerId);
    const newFav = isFav
      ? current.favoriteMarkerIds.filter((id) => id !== markerId)
      : [...current.favoriteMarkerIds, markerId];

    this.saveProgress({ favoriteMarkerIds: newFav });
    return !isFav;
  },

  saveNote(markerId: string, note: string): void {
    const current = this.getProgress();
    const updatedNotes = { ...current.userNotes };
    if (note.trim() === '') {
      delete updatedNotes[markerId];
    } else {
      updatedNotes[markerId] = note;
    }
    this.saveProgress({ userNotes: updatedNotes });
  },

  resetAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('gtavimap_progress_updated', { detail: DEFAULT_PROGRESS }));
  },

  exportBackupJson(): string {
    const progress = this.getProgress();
    return JSON.stringify(
      {
        app: 'GTAVIMap',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        progress,
      },
      null,
      2
    );
  },

  importBackupJson(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.progress) {
        this.saveProgress(parsed.progress);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Falha ao importar JSON de backup:', e);
      return false;
    }
  },
};
