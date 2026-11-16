import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const KNOWN_BOTS = /googlebot|bingbot/i;

function getLanguageFromAcceptHeader(header: string | null): 'en' | 'pt-br' | 'es' {
  if (!header) return 'en';

  const parts = header.split(',').map((part) => {
    const [tag, qPart] = part.trim().split(';');
    const q = qPart && qPart.trim().startsWith('q=') ? parseFloat(qPart.trim().slice(2)) : 1.0;
    return { tag: tag.trim().toLowerCase(), q: isNaN(q) ? 0 : q };
  });

  parts.sort((a, b) => b.q - a.q);

  for (const { tag } of parts) {
    if (tag.startsWith('pt')) return 'pt-br';
    if (tag.startsWith('es')) return 'es';
    if (tag.startsWith('en')) return 'en';
  }

  return 'en';
}

function getValidLangCookie(val: string | undefined): 'en' | 'pt-br' | 'es' | null {
  if (!val) return null;
  const normalized = val.toLowerCase().trim();
  if (normalized === 'pt-br' || normalized === 'pt') return 'pt-br';
  if (normalized === 'es') return 'es';
  if (normalized === 'en') return 'en';
  return null;
}

export function proxy(request: NextRequest) {
  // Executar a lógica de redirecionamento SOMENTE na rota raiz '/'
  if (request.nextUrl.pathname !== '/') {
    return NextResponse.next();
  }

  // 1. Crawlers conhecidos (Googlebot, Bingbot): redirecionar para /en (hreflang/x-default tratam a indexação)
  const userAgent = request.headers.get('user-agent') || '';
  if (KNOWN_BOTS.test(userAgent)) {
    return NextResponse.redirect(new URL('/en', request.url), 307);
  }

  // 2. Cookie 'lang' (se existir e for válido, tem prioridade)
  const cookieLang = getValidLangCookie(request.cookies.get('lang')?.value);
  if (cookieLang) {
    return NextResponse.redirect(new URL(`/${cookieLang}`, request.url), 307);
  }

  // 3. Header Accept-Language: pt* -> pt-br, es* -> es, demais -> en
  const acceptLanguage = request.headers.get('accept-language');
  const targetLang = getLanguageFromAcceptHeader(acceptLanguage);

  return NextResponse.redirect(new URL(`/${targetLang}`, request.url), 307);
}

export const config = {
  matcher: ['/'],
};
