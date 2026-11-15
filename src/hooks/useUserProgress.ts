'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserProgress } from '@/types';
import { StorageService } from '@/services/storageService';

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress>({
    foundMarkerIds: [],
    favoriteMarkerIds: [],
    userNotes: {},
    updatedAt: '',
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Inicialização no cliente
    const current = StorageService.getProgress();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(current);
    setIsLoaded(true);

    const handleProgressUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<UserProgress>;
      if (customEvent.detail) {
        setProgress(customEvent.detail);
      } else {
        setProgress(StorageService.getProgress());
      }
    };

    window.addEventListener('gtavimap_progress_updated', handleProgressUpdate);
    window.addEventListener('storage', handleProgressUpdate);

    return () => {
      window.removeEventListener('gtavimap_progress_updated', handleProgressUpdate);
      window.removeEventListener('storage', handleProgressUpdate);
    };
  }, []);

  const toggleFound = useCallback((markerId: string) => {
    return StorageService.toggleFound(markerId);
  }, []);

  const toggleFavorite = useCallback((markerId: string) => {
    return StorageService.toggleFavorite(markerId);
  }, []);

  const saveNote = useCallback((markerId: string, note: string) => {
    StorageService.saveNote(markerId, note);
  }, []);

  const resetAll = useCallback(() => {
    StorageService.resetAll();
  }, []);

  const isFound = useCallback(
    (markerId: string) => progress.foundMarkerIds.includes(markerId),
    [progress.foundMarkerIds]
  );

  const isFavorite = useCallback(
    (markerId: string) => progress.favoriteMarkerIds.includes(markerId),
    [progress.favoriteMarkerIds]
  );

  return {
    progress,
    isLoaded,
    toggleFound,
    toggleFavorite,
    saveNote,
    resetAll,
    isFound,
    isFavorite,
    foundCount: progress.foundMarkerIds.length,
    favoriteCount: progress.favoriteMarkerIds.length,
  };
}
