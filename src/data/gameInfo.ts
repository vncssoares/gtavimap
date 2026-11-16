export const LAUNCH_AT_ISO = '2026-11-19T00:00:00Z';

export interface CountdownLabels {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  availableNow: string;
  expectedLaunch: string;
}

export const COUNTDOWN_LABELS: Record<'en' | 'pt-BR' | 'es', CountdownLabels> = {
  en: {
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    availableNow: 'Grand Theft Auto VI is Now Available!',
    expectedLaunch: 'Expected Release Countdown',
  },
  'pt-BR': {
    days: 'Dias',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos',
    availableNow: 'Grand Theft Auto VI já está disponível!',
    expectedLaunch: 'Contagem Regressiva para o Lançamento',
  },
  es: {
    days: 'Días',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos',
    availableNow: '¡Grand Theft Auto VI ya está disponible!',
    expectedLaunch: 'Cuenta Regresiva para el Lanzamiento',
  },
};
