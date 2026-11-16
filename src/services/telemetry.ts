export type TelemetryEvent =
  | 'map_activate'
  | 'open_fullscreen'
  | 'region_click'
  | 'trailer_play';

export function trackEvent(eventName: TelemetryEvent, payload?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  try {
    // 1. Dispatch custom DOM event
    window.dispatchEvent(
      new CustomEvent('gtavimap_analytics', {
        detail: { event: eventName, payload, timestamp: Date.now() },
      })
    );

    // 2. dataLayer support if available
    const win = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
    if (Array.isArray(win.dataLayer)) {
      win.dataLayer.push({ event: eventName, ...payload });
    }

    // 3. Dev logger
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Telemetry] ${eventName}`, payload || {});
    }
  } catch {
    // Silent catch
  }
}
