import { hasConsent } from './consent';

let isScriptInjected = false;

function ensureAnalyticsScript(): void {
  if (typeof document === 'undefined') return;

  const scriptSrc = process.env.NEXT_PUBLIC_ANALYTICS_SRC;
  if (!scriptSrc) return;

  if (isScriptInjected || document.getElementById('gtavimap-analytics-script')) {
    isScriptInjected = true;
    return;
  }

  const script = document.createElement('script');
  script.id = 'gtavimap-analytics-script';
  script.src = scriptSrc;
  script.defer = true;

  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID;
  if (analyticsId) {
    script.setAttribute('data-website-id', analyticsId);
    script.setAttribute('data-domain', window.location.hostname);
  }

  document.head.appendChild(script);
  isScriptInjected = true;
}

export function track(evento: string, props?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  // 1. Verifica se há consentimento para medição
  if (!hasConsent('measurement')) {
    return;
  }

  // 2. Verifica se a variável de ambiente do provedor está configurada
  const scriptSrc = process.env.NEXT_PUBLIC_ANALYTICS_SRC;
  if (!scriptSrc) {
    return;
  }

  // 3. Injeta o script de terceiros uma única vez
  ensureAnalyticsScript();

  // 4. Encaminha o evento para provedores universais sem acoplar a uma biblioteca específica
  try {
    const win = window as unknown as {
      dataLayer?: Array<Record<string, unknown>>;
      plausible?: (name: string, options?: { props?: Record<string, unknown> }) => void;
      umami?: { track: (name: string, data?: Record<string, unknown>) => void };
    };

    if (Array.isArray(win.dataLayer)) {
      win.dataLayer.push({ event: evento, ...props });
    }

    if (typeof win.plausible === 'function') {
      win.plausible(evento, { props });
    }

    if (win.umami && typeof win.umami.track === 'function') {
      win.umami.track(evento, props);
    }

    // Dispara evento DOM para integrações customizadas
    window.dispatchEvent(
      new CustomEvent('gtavimap_analytics_track', {
        detail: { event: evento, props, timestamp: Date.now() },
      })
    );
  } catch {
    // Falha silenciosa para não degradar a experiência do usuário
  }
}
