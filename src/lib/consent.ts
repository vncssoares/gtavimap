export interface ConsentPreferences {
  necessary: boolean;
  measurement: boolean;
  marketing: boolean;
  timestamp: number;
}

const COOKIE_NAME = 'cookie_consent';
const MAX_AGE_SECONDS = 31536000; // 12 meses (365 dias)

export function getConsent(): ConsentPreferences | null {
  if (typeof document === 'undefined') return null;

  try {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, ...rest] = cookie.trim().split('=');
      if (name === COOKIE_NAME) {
        const val = decodeURIComponent(rest.join('='));
        const parsed = JSON.parse(val);
        if (typeof parsed === 'object' && parsed !== null) {
          return {
            necessary: true,
            measurement: Boolean(parsed.measurement),
            marketing: Boolean(parsed.marketing),
            timestamp: typeof parsed.timestamp === 'number' ? parsed.timestamp : Date.now(),
          };
        }
      }
    }
  } catch {
    // Retorno fallback silencioso se JSON inválido
  }
  return null;
}

export function hasConsent(category: 'measurement' | 'marketing'): boolean {
  const current = getConsent();
  if (!current) return false;
  return Boolean(current[category]);
}

export function saveConsent(prefs: { measurement: boolean; marketing: boolean }): void {
  if (typeof document === 'undefined') return;

  const data: ConsentPreferences = {
    necessary: true,
    measurement: Boolean(prefs.measurement),
    marketing: Boolean(prefs.marketing),
    timestamp: Date.now(),
  };

  const serialized = encodeURIComponent(JSON.stringify(data));
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const secureFlag = isSecure ? '; Secure' : '';

  // SameSite=Lax, 12 meses de retenção
  document.cookie = `${COOKIE_NAME}=${serialized}; max-age=${MAX_AGE_SECONDS}; path=/; SameSite=Lax${secureFlag}`;

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('gtavimap_consent_changed', { detail: data }));
  }
}

export function openConsentBanner(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('gtavimap_open_consent'));
  }
}
