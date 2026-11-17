#!/usr/bin/env node

/**
 * Validador de dados editoriais de Gameplay e Notícias/Changelog (sem dependências externas).
 * Executado via "npm run validate:data" ou no prebuild.
 */

import { GAMEPLAY_ITEMS } from '../src/data/gameplay.ts';
import { NEWS_ITEMS } from '../src/data/news.ts';

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
const KEBAB_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const REQUIRED_LANGS = ['en', 'pt-BR', 'es'];

const errors = [];
const isVerifiedMode = process.env.DATA_MODE === 'verified';

console.log(`🔍 Validando conteúdo editorial (DATA_MODE=${process.env.DATA_MODE || 'default'})...`);

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidIsoDate(string) {
  if (typeof string !== 'string') return false;
  return ISO_DATE_REGEX.test(string) && !Number.isNaN(Date.parse(string));
}

// 1. Validação de GAMEPLAY_ITEMS
GAMEPLAY_ITEMS.forEach((item, index) => {
  const prefix = `[Gameplay #${index} ID: "${item?.id || 'SEM_ID'}"]`;

  if (!item.id || typeof item.id !== 'string') {
    errors.push(`${prefix}: "id" é obrigatório.`);
  }

  if (!item.slug || typeof item.slug !== 'string' || !KEBAB_REGEX.test(item.slug)) {
    errors.push(`${prefix}: "slug" é obrigatório e deve estar em formato kebab-case.`);
  }

  if (!item.categoryId || typeof item.categoryId !== 'string') {
    errors.push(`${prefix}: "categoryId" é obrigatória para o redirecionamento ao mapa.`);
  }

  // Textos nos 3 idiomas
  if (!item.title || typeof item.title !== 'object') {
    errors.push(`${prefix}: "title" deve ser um objeto contendo os 3 idiomas.`);
  } else {
    REQUIRED_LANGS.forEach((lang) => {
      if (!item.title[lang] || typeof item.title[lang] !== 'string' || item.title[lang].trim() === '') {
        errors.push(`${prefix}: "title.${lang}" é obrigatório.`);
      }
    });
  }

  if (!item.summary || typeof item.summary !== 'object') {
    errors.push(`${prefix}: "summary" deve ser um objeto contendo os 3 idiomas.`);
  } else {
    REQUIRED_LANGS.forEach((lang) => {
      if (!item.summary[lang] || typeof item.summary[lang] !== 'string' || item.summary[lang].trim() === '') {
        errors.push(`${prefix}: "summary.${lang}" é obrigatório.`);
      }
    });
  }

  // Fatos do jogo exigem fonte oficial, data ISO e nível de confiança
  if (item.kind !== 'game') {
    errors.push(`${prefix}: Itens de gameplay devem possuir kind === 'game'.`);
  }

  if (!item.sourceUrl || !isValidUrl(item.sourceUrl)) {
    errors.push(`${prefix}: "sourceUrl" é obrigatório e deve ser uma URL válida apontando para a fonte oficial.`);
  }

  if (!item.publishedAt || !isValidIsoDate(item.publishedAt)) {
    errors.push(`${prefix}: "publishedAt" é obrigatório e deve estar em formato ISO 8601.`);
  }

  if (!['official', 'community_analysis'].includes(item.confidence)) {
    errors.push(`${prefix}: "confidence" deve ser 'official' ou 'community_analysis'.`);
  }

  // Regra de produção/verified: nenhum placeholder pode existir quando DATA_MODE=verified
  if (isVerifiedMode && item.placeholder === true) {
    errors.push(`${prefix}: Item possui placeholder: true, o que é proibido quando DATA_MODE=verified.`);
  }
});

// 2. Validação de NEWS_ITEMS
NEWS_ITEMS.forEach((item, index) => {
  const prefix = `[News #${index} ID: "${item?.id || 'SEM_ID'}"]`;

  if (!item.id || typeof item.id !== 'string') {
    errors.push(`${prefix}: "id" é obrigatório.`);
  }

  if (!item.slug || typeof item.slug !== 'string' || !KEBAB_REGEX.test(item.slug)) {
    errors.push(`${prefix}: "slug" é obrigatório e deve estar em formato kebab-case.`);
  }

  if (!['game', 'site'].includes(item.kind)) {
    errors.push(`${prefix}: "kind" deve ser 'game' ou 'site'.`);
  }

  // Textos nos 3 idiomas
  if (!item.title || typeof item.title !== 'object') {
    errors.push(`${prefix}: "title" deve ser um objeto contendo os 3 idiomas.`);
  } else {
    REQUIRED_LANGS.forEach((lang) => {
      if (!item.title[lang] || typeof item.title[lang] !== 'string' || item.title[lang].trim() === '') {
        errors.push(`${prefix}: "title.${lang}" é obrigatório.`);
      }
    });
  }

  if (!item.summary || typeof item.summary !== 'object') {
    errors.push(`${prefix}: "summary" deve ser um objeto contendo os 3 idiomas.`);
  } else {
    REQUIRED_LANGS.forEach((lang) => {
      if (!item.summary[lang] || typeof item.summary[lang] !== 'string' || item.summary[lang].trim() === '') {
        errors.push(`${prefix}: "summary.${lang}" é obrigatório.`);
      }
    });
  }

  if (!item.publishedAt || !isValidIsoDate(item.publishedAt)) {
    errors.push(`${prefix}: "publishedAt" é obrigatório e deve estar em formato ISO 8601.`);
  }

  // Se for fato do jogo, sourceUrl e confidence são obrigatórios
  if (item.kind === 'game') {
    if (!item.sourceUrl || !isValidUrl(item.sourceUrl)) {
      errors.push(`${prefix}: Fato do jogo (kind === 'game') exige "sourceUrl" válida para fonte oficial.`);
    }

    if (!['official', 'community_analysis'].includes(item.confidence)) {
      errors.push(`${prefix}: Fato do jogo exige "confidence" ('official' ou 'community_analysis').`);
    }
  }

  // Regra de produção/verified: nenhum placeholder pode existir quando DATA_MODE=verified
  if (isVerifiedMode && item.placeholder === true) {
    errors.push(`${prefix}: Item possui placeholder: true, o que é proibido quando DATA_MODE=verified.`);
  }
});

if (errors.length > 0) {
  console.error(`\n❌ Falha na validação de conteúdo editorial (${errors.length} erro(s) encontrado(s)):`);
  errors.forEach((err) => console.error(` - ${err}`));
  process.exit(1);
}

console.log(`✓ Sucesso: ${GAMEPLAY_ITEMS.length} itens de gameplay e ${NEWS_ITEMS.length} itens de notícias/changelog validados com sucesso.`);
process.exit(0);
