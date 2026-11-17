#!/usr/bin/env node

/**
 * Validador de dados verificados de marcadores (sem dependências externas).
 * Executado via "npm run validate:data" ou no prebuild com DATA_MODE=verified.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.resolve(__dirname, '../src/data/verified/markers.json');

console.log('🔍 Validando dados verificados em:', jsonPath);

if (!fs.existsSync(jsonPath)) {
  console.error(`❌ Erro: Arquivo ${jsonPath} não foi encontrado.`);
  process.exit(1);
}

let content;
try {
  const raw = fs.readFileSync(jsonPath, 'utf8');
  content = JSON.parse(raw);
} catch (err) {
  console.error(`❌ Erro: O arquivo não contém um JSON válido:`, err.message);
  process.exit(1);
}

if (!Array.isArray(content)) {
  console.error(`❌ Erro: O arquivo deve conter um array de marcadores JSON.`);
  process.exit(1);
}

// Array vazio é perfeitamente válido (estado inicial do projeto)
if (content.length === 0) {
  console.log('✓ Sucesso: Nenhum marcador verificado cadastrado ainda (array vazio é válido).');
} else {
  const errors = [];
  const seenIds = new Set();
  const seenCategorySlugs = new Set();

  const KEBAB_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

content.forEach((marker, index) => {
  const prefix = `[Marcador #${index} ID: "${marker?.id || 'SEM_ID'}"]`;

  // 1. Validação de ID
  if (!marker.id || typeof marker.id !== 'string' || marker.id.trim() === '') {
    errors.push(`${prefix}: "id" é obrigatório e deve ser uma string não vazia.`);
  } else if (seenIds.has(marker.id)) {
    errors.push(`${prefix}: "id" duplicado: "${marker.id}". IDs devem ser únicos.`);
  } else {
    seenIds.add(marker.id);
  }

  // 2. Validação de Categoria
  if (!marker.category || typeof marker.category !== 'string' || marker.category.trim() === '') {
    errors.push(`${prefix}: "category" é obrigatória.`);
  }

  // 3. Validação de Slug (kebab-case e único por categoria)
  if (!marker.slug || typeof marker.slug !== 'string' || marker.slug.trim() === '') {
    errors.push(`${prefix}: "slug" é obrigatório.`);
  } else {
    if (!KEBAB_REGEX.test(marker.slug)) {
      errors.push(`${prefix}: "slug" "${marker.slug}" inválido. Deve estar em formato kebab-case (apenas letras minúsculas, números e hífens).`);
    }

    if (marker.category) {
      const categorySlugKey = `${marker.category}:${marker.slug}`;
      if (seenCategorySlugs.has(categorySlugKey)) {
        errors.push(`${prefix}: "slug" "${marker.slug}" duplicado para a categoria "${marker.category}". Slugs devem ser únicos por categoria.`);
      } else {
        seenCategorySlugs.add(categorySlugKey);
      }
    }
  }

  // 4. Validação de Coordenadas X e Y (0 a 1000)
  if (typeof marker.x !== 'number' || Number.isNaN(marker.x) || marker.x < 0 || marker.x > 1000) {
    errors.push(`${prefix}: "x" deve ser um número entre 0 e 1000. Valor atual: ${marker.x}`);
  }
  if (typeof marker.y !== 'number' || Number.isNaN(marker.y) || marker.y < 0 || marker.y > 1000) {
    errors.push(`${prefix}: "y" deve ser um número entre 0 e 1000. Valor atual: ${marker.y}`);
  }

  // 5. Validação de Descrição nos 3 idiomas
  if (!marker.description || typeof marker.description !== 'object') {
    errors.push(`${prefix}: "description" deve ser um objeto contendo os idiomas 'en', 'pt-BR' e 'es'.`);
  } else {
    ['en', 'pt-BR', 'es'].forEach((lang) => {
      const text = marker.description[lang];
      if (!text || typeof text !== 'string' || text.trim() === '') {
        errors.push(`${prefix}: "description.${lang}" não pode ser vazia.`);
      }
    });
  }

  // 6. Validação de Status 'verified'
  if (marker.confirmationStatus === 'verified') {
    if (!marker.source || typeof marker.source !== 'string' || marker.source.trim() === '') {
      errors.push(`${prefix}: Marcadores com status 'verified' exigem campo "source" preenchido com evidência comprobatória.`);
    }

    if (!marker.verifiedAt || typeof marker.verifiedAt !== 'string') {
      errors.push(`${prefix}: Marcadores com status 'verified' exigem campo "verifiedAt" em formato ISO 8601.`);
    } else if (!ISO_DATE_REGEX.test(marker.verifiedAt) || Number.isNaN(Date.parse(marker.verifiedAt))) {
      errors.push(`${prefix}: "verifiedAt" ("${marker.verifiedAt}") não é uma data ISO 8601 válida.`);
    }
  }
});

  if (errors.length > 0) {
    console.error(`\n❌ Falha na validação dos dados verificados (${errors.length} erro(s) encontrado(s)):`);
    errors.forEach((err) => console.error(` - ${err}`));
    process.exit(1);
  }

  console.log(`\n✓ Sucesso: Todos os ${content.length} marcadores verificados são válidos e estão conformes com as diretrizes.`);
}

// 2. Executa validação de conteúdo de gameplay e notícias
try {
  execSync('node scripts/validate-content.mjs', { stdio: 'inherit' });
} catch {
  process.exit(1);
}

process.exit(0);
