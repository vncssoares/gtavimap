#!/usr/bin/env node

/**
 * Script de Verificação e Auditoria de SEO e Indexabilidade (Node 20+, zero dependências).
 * Executado via "npm run check:seo".
 * 
 * Impede publicação em produção com erros de indexação, canonical, hreflang,
 * imagens OpenGraph, JSON-LD ou vazamento de dados de demonstração/spoilers.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// -----------------------------------------------------------------------------
// Configurações & Hospedagens Permitidas
// -----------------------------------------------------------------------------
const ALLOWED_IMAGE_HOSTS = new Set([
  'gtavimap.com',
  'www.gtavimap.com',
  'localhost',
  '127.0.0.1',
  'i.ytimg.com',
  'img.youtube.com',
]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Argumentos de linha de comando
const args = process.argv.slice(2);
const onlyArg = args.find((a) => a.startsWith('--only='));
const onlyFilter = onlyArg ? onlyArg.replace('--only=', '').trim() : null;

const BASE_URL = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const isSiteIndexingOff = process.env.SITE_INDEXING === 'off';

console.log('='.repeat(80));
console.log(`🚀 GTAVIMap SEO & Indexing Verifier`);
console.log(`   Base URL: ${BASE_URL}`);
console.log(`   SITE_INDEXING: ${isSiteIndexingOff ? 'OFF (noindex esperado)' : 'ON (indexação ativa)'}`);
if (onlyFilter) {
  console.log(`   Filtro --only: "${onlyFilter}"`);
}
console.log('='.repeat(80) + '\n');

// -----------------------------------------------------------------------------
// Utilitários de Requisição e Resolução de URL
// -----------------------------------------------------------------------------
function resolveToLocalUrl(targetUrl) {
  try {
    if (targetUrl.startsWith('/')) {
      return `${BASE_URL}${targetUrl}`;
    }
    const u = new URL(targetUrl);
    return `${BASE_URL}${u.pathname}${u.search}`;
  } catch {
    return targetUrl;
  }
}

function normalizePath(urlString) {
  try {
    const u = new URL(urlString, 'https://gtavimap.com');
    return u.pathname.replace(/\/$/, '') || '/';
  } catch {
    return urlString;
  }
}

function stripHtmlTags(html) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// -----------------------------------------------------------------------------
// Execução Principal
// -----------------------------------------------------------------------------
async function run() {
  const startTime = Date.now();
  let globalFailures = 0;
  const urlResults = [];

  // 1. Verificações Globais: /robots.txt e /sitemap.xml
  console.log('📋 [1/3] Verificando endpoints globais (/robots.txt e /sitemap.xml)...');

  let robotsTxt = '';
  let sitemapXml = '';

  try {
    const resRobots = await fetch(`${BASE_URL}/robots.txt`);
    if (resRobots.status !== 200) {
      console.error(`❌ FALHA: /robots.txt respondeu status ${resRobots.status}`);
      globalFailures++;
    } else {
      robotsTxt = await resRobots.text();
      console.log('  ✓ /robots.txt respondeu 200 OK');
    }
  } catch (err) {
    console.error(`❌ FALHA: Erro ao consultar /robots.txt:`, err.message);
    globalFailures++;
  }

  try {
    const resSitemap = await fetch(`${BASE_URL}/sitemap.xml`);
    if (resSitemap.status !== 200) {
      console.error(`❌ FALHA: /sitemap.xml respondeu status ${resSitemap.status}`);
      globalFailures++;
    } else {
      sitemapXml = await resSitemap.text();
      console.log('  ✓ /sitemap.xml respondeu 200 OK');
    }
  } catch (err) {
    console.error(`❌ FALHA: Erro ao consultar /sitemap.xml:`, err.message);
    globalFailures++;
  }

  // Validação de SITE_INDEXING em robots.txt e sitemap.xml
  const sitemapLocs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

  if (isSiteIndexingOff) {
    // Quando OFF: robots deve bloquear tudo e sitemap deve ser vazio
    const blocksAll = /Disallow:\s*\/\s*($|\n)/i.test(robotsTxt);
    if (!blocksAll) {
      console.error('❌ FALHA: SITE_INDEXING=off exige que robots.txt contenha "Disallow: /" para todos os agentes.');
      globalFailures++;
    } else {
      console.log('  ✓ robots.txt bloqueia rastreamento com "Disallow: /" (SITE_INDEXING=off)');
    }

    if (sitemapLocs.length > 0) {
      console.error(`❌ FALHA: SITE_INDEXING=off exige sitemap vazio, mas ${sitemapLocs.length} URLs foram encontradas.`);
      globalFailures++;
    } else {
      console.log('  ✓ sitemap.xml está vazio conforme esperado (SITE_INDEXING=off)');
    }
  } else {
    // Quando ON: sitemap deve ter URLs
    if (sitemapLocs.length === 0) {
      console.error('❌ FALHA: SITE_INDEXING=on exige que o sitemap.xml contenha URLs indexáveis, mas nenhuma foi retornada.');
      globalFailures++;
    } else {
      console.log(`  ✓ sitemap.xml contém ${sitemapLocs.length} URLs indexáveis.`);
    }
  }

  // 2. Extração de marcadores demo e spoilers do repositório de dados
  console.log('\n🔍 [2/3] Carregando regras de integridade de dados (demo markers & spoilers)...');
  const demoMarkerSlugs = new Set();
  const spoilerMarkerDescriptions = [];

  try {
    const verifiedPath = path.join(__dirname, '../src/data/verified/markers.json');
    if (fs.existsSync(verifiedPath)) {
      const verifiedContent = fs.readFileSync(verifiedPath, 'utf8');
      if (verifiedContent.trim()) {
        const verifiedData = JSON.parse(verifiedContent);
        if (Array.isArray(verifiedData)) {
          verifiedData.forEach((m) => {
            if (m.confirmationStatus === 'demo' || m.confirmationStatus === 'trailer_rumor') {
              if (m.slug) demoMarkerSlugs.add(m.slug.toLowerCase());
            }
            if (m.spoiler && m.description) {
              Object.values(m.description).forEach((text) => {
                if (text && text.trim().length > 10) {
                  spoilerMarkerDescriptions.push(text.trim());
                }
              });
            }
          });
        }
      }
    }

    const demoPath = path.join(__dirname, '../src/data/markers.demo.ts');
    if (fs.existsSync(demoPath)) {
      const demoContent = fs.readFileSync(demoPath, 'utf8');
      // Extração de slugs de demonstração
      const slugMatches = [...demoContent.matchAll(/slug:\s*['"]([^'"]+)['"]/g)];
      slugMatches.forEach((m) => demoMarkerSlugs.add(m[1].toLowerCase()));

      // Extração de descrições com spoiler (missões ou spoiler: true)
      const objBlocks = demoContent.split(/\{\s*id:\s*['"]/);
      for (const block of objBlocks) {
        const isMission = block.includes("category: 'missions'") || block.includes('category: "missions"');
        const isSpoiler = isMission || /spoiler:\s*true/.test(block);
        if (isSpoiler) {
          const descMatches = [...block.matchAll(/(?:en|'pt-BR'|"pt-BR"|es):\s*['"]([^'"]+)['"]/g)];
          descMatches.forEach((dm) => {
            if (dm[1] && dm[1].trim().length > 10) {
              spoilerMarkerDescriptions.push(dm[1].trim());
            }
          });
        }
      }
    }

    console.log(`  ✓ Identificados ${demoMarkerSlugs.size} marcadores demo/rumor e ${spoilerMarkerDescriptions.length} descrições com spoiler.`);
  } catch (err) {
    console.warn(`  ⚠️ Aviso ao carregar repositório de marcadores:`, err.message);
  }

  // 3. Verificação por URL
  console.log('\n📄 [3/3] Auditando páginas individuais...');

  // Se o sitemap estiver vazio (por exemplo, quando SITE_INDEXING=off), testamos rotas canônicas essenciais
  let targetUrls = sitemapLocs;
  if (targetUrls.length === 0) {
    targetUrls = [
      'https://gtavimap.com/pt-br',
      'https://gtavimap.com/en',
      'https://gtavimap.com/es',
      'https://gtavimap.com/pt-br/map',
      'https://gtavimap.com/pt-br/categories',
    ];
  }

  if (onlyFilter) {
    targetUrls = targetUrls.filter((u) => u.includes(onlyFilter));
    console.log(`  🔍 Filtro aplicado: ${targetUrls.length} URL(s) selecionada(s) para validação.`);
  }

  for (const sitemapUrl of targetUrls) {
    const fetchUrl = resolveToLocalUrl(sitemapUrl);
    const pathname = normalizePath(sitemapUrl);
    const checks = {
      url: pathname,
      status200: false,
      titleOk: false,
      descOk: false,
      canonicalOk: false,
      hreflangOk: false,
      ogImageOk: false,
      jsonLdOk: false,
      h1Ok: false,
      contentOk: false,
      errors: [],
    };

    try {
      const res = await fetch(fetchUrl);
      checks.status200 = res.status === 200;
      if (!checks.status200) {
        checks.errors.push(`Status HTTP ${res.status} (esperado 200)`);
      }

      const html = await res.text();
      const xRobotsTag = res.headers.get('x-robots-tag') || '';
      const metaRobotsMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i);
      const metaRobots = metaRobotsMatch ? metaRobotsMatch[1] : '';

      // Regra de Indexabilidade da Página
      if (isSiteIndexingOff) {
        const hasNoindex = /noindex/i.test(metaRobots) || /noindex/i.test(xRobotsTag);
        if (!hasNoindex) {
          checks.errors.push(`SITE_INDEXING=off, mas a página não contém noindex em meta ou X-Robots-Tag`);
        }
      } else {
        const hasNoindex = /noindex/i.test(metaRobots) || /noindex/i.test(xRobotsTag);
        if (hasNoindex) {
          checks.errors.push(`Página do sitemap possui noindex indevido (meta="${metaRobots}", x-robots="${xRobotsTag}")`);
        }
      }

      // 3.1 Exatamente um <title> (entre 20 e 65 caracteres)
      const titleMatches = [...html.matchAll(/<title[^>]*>([^<]*)<\/title>/gi)];
      if (titleMatches.length !== 1) {
        checks.errors.push(`Possui ${titleMatches.length} tags <title> (esperado exatamente 1)`);
      } else {
        const titleText = titleMatches[0][1].trim();
        if (titleText.length < 20 || titleText.length > 65) {
          checks.errors.push(`<title> tamanho ${titleText.length} fora da faixa [20, 65]: "${titleText}"`);
        } else {
          checks.titleOk = true;
        }
      }

      // 3.2 Exatamente uma meta description (entre 70 e 170 caracteres)
      const descMatches = [
        ...html.matchAll(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/gi),
        ...html.matchAll(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/gi),
      ];
      if (descMatches.length === 0) {
        checks.errors.push('Meta description ausente');
      } else if (descMatches.length > 1) {
        checks.errors.push(`Possui ${descMatches.length} meta descriptions (esperado 1)`);
      } else {
        const descText = descMatches[0][1].trim();
        if (descText.length < 70 || descText.length > 170) {
          checks.errors.push(`Meta description tamanho ${descText.length} fora da faixa [70, 170]`);
        } else {
          checks.descOk = true;
        }
      }

      // 3.3 Canonical igual à própria URL sem parâmetros
      const canonicalMatches = [
        ...html.matchAll(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/gi),
        ...html.matchAll(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/gi),
      ];
      if (canonicalMatches.length !== 1) {
        checks.errors.push(`Possui ${canonicalMatches.length} links canonical (esperado 1)`);
      } else {
        const canonicalHref = canonicalMatches[0][1].trim();
        const canonicalPath = normalizePath(canonicalHref);
        if (canonicalPath !== pathname) {
          checks.errors.push(`Canonical path "${canonicalPath}" não confere com a URL da página "${pathname}"`);
        } else {
          checks.canonicalOk = true;
        }
      }

      // 3.4 Hreflang recíprocos (en, pt-BR/pt-br, es, x-default)
      const alternateMatches = [
        ...html.matchAll(/<link[^>]*rel=["']alternate["'][^>]*hreflang=["']([^"']*)["'][^>]*href=["']([^"']*)["']/gi),
        ...html.matchAll(/<link[^>]*hreflang=["']([^"']*)["'][^>]*href=["']([^"']*)["']/gi),
        ...html.matchAll(/<link[^>]*href=["']([^"']*)["'][^>]*hreflang=["']([^"']*)["']/gi),
      ];

      const foundHreflangs = new Map();
      alternateMatches.forEach((m) => {
        const lang = m[1].toLowerCase();
        const href = m[2];
        foundHreflangs.set(lang, href);
      });

      const hasEn = foundHreflangs.has('en');
      const hasPt = foundHreflangs.has('pt-br') || foundHreflangs.has('pt-br');
      const hasEs = foundHreflangs.has('es');
      const hasDefault = foundHreflangs.has('x-default');

      if (!hasEn || !hasPt || !hasEs || !hasDefault) {
        checks.errors.push(`Hreflangs incompletos (en:${hasEn}, pt:${hasPt}, es:${hasEs}, x-default:${hasDefault})`);
      } else {
        checks.hreflangOk = true;
      }

      // 3.5 OG:image e Twitter:image (status 200 e content-type image/*)
      const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i) ||
                           html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:image["']/i);
      const twitterImageMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']*)["']/i) ||
                                html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']twitter:image["']/i);

      if (!ogImageMatch && !twitterImageMatch) {
        checks.errors.push('og:image e twitter:image ausentes');
      } else {
        let imagesValid = true;
        const imagesToCheck = [ogImageMatch?.[1], twitterImageMatch?.[1]].filter(Boolean);

        for (const imgUrl of imagesToCheck) {
          const fetchImgUrl = resolveToLocalUrl(imgUrl);
          try {
            const imgRes = await fetch(fetchImgUrl);
            const contentType = imgRes.headers.get('content-type') || '';
            if (imgRes.status !== 200 || !contentType.startsWith('image/')) {
              checks.errors.push(`Imagem ${imgUrl} retornou status ${imgRes.status} (content-type: ${contentType})`);
              imagesValid = false;
            }
          } catch (imgErr) {
            checks.errors.push(`Falha ao carregar imagem ${imgUrl}: ${imgErr.message}`);
            imagesValid = false;
          }
        }
        checks.ogImageOk = imagesValid;
      }

      // 3.6 JSON-LD parse sem erro e FAQPage verificado
      const jsonLdMatches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
      let jsonLdParsedAll = true;

      for (const m of jsonLdMatches) {
        try {
          const parsed = JSON.parse(m[1]);
          const entities = Array.isArray(parsed) ? parsed : [parsed];

          for (const entity of entities) {
            // Validação de FAQPage
            if (entity['@type'] === 'FAQPage' && Array.isArray(entity.mainEntity)) {
              const visibleText = stripHtmlTags(html);
              for (const faq of entity.mainEntity) {
                const question = faq.name || '';
                const answer = faq.acceptedAnswer?.text || '';

                if (question && !visibleText.includes(question.trim())) {
                  checks.errors.push(`FAQPage: Pergunta "${question.slice(0, 30)}..." não encontrada no texto visível`);
                  jsonLdParsedAll = false;
                }
                if (answer && !visibleText.includes(answer.trim())) {
                  checks.errors.push(`FAQPage: Resposta "${answer.slice(0, 30)}..." não encontrada no texto visível`);
                  jsonLdParsedAll = false;
                }
              }
            }
          }
        } catch (jsonErr) {
          checks.errors.push(`JSON-LD inválido: ${jsonErr.message}`);
          jsonLdParsedAll = false;
        }
      }
      checks.jsonLdOk = jsonLdParsedAll;

      // 3.7 Exatamente um H1
      const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
      if (h1Matches.length !== 1) {
        checks.errors.push(`Possui ${h1Matches.length} tags <h1> (esperado exatamente 1)`);
      } else {
        checks.h1Ok = true;
      }

      // 4. Verificações de Conteúdo:
      let contentChecksValid = true;

      // 4.1 Nenhuma URL do sitemap corresponde a marcador com status demo ou trailer_rumor
      for (const demoSlug of demoMarkerSlugs) {
        if (pathname.includes(`/${demoSlug}`)) {
          checks.errors.push(`URL do sitemap expõe marcador demo/rumor "${demoSlug}"`);
          contentChecksValid = false;
        }
      }

      // 4.2 Nenhum marcador spoiler expõe descrição no HTML
      for (const spoilerText of spoilerMarkerDescriptions) {
        if (html.includes(spoilerText)) {
          checks.errors.push(`Página expõe texto de descrição de marcador com spoiler: "${spoilerText.slice(0, 35)}..."`);
          contentChecksValid = false;
        }
      }

      // 4.3 Imagens com src externo fora das hospedagens permitidas
      const imgMatches = [...html.matchAll(/<img[^>]*src=["']([^"']*)["']/gi)];
      for (const m of imgMatches) {
        const src = m[1].trim();
        if (src.startsWith('data:') || src.startsWith('blob:')) continue;
        if (src.startsWith('/') || src.startsWith('./')) continue;

        try {
          const parsedSrc = new URL(src);
          if (!ALLOWED_IMAGE_HOSTS.has(parsedSrc.hostname)) {
            checks.errors.push(`Imagem externa com host não permitido: "${parsedSrc.hostname}" (src="${src.slice(0, 40)}")`);
            contentChecksValid = false;
          }
        } catch {
          // URL relativa não parseável como absoluta
        }
      }

      checks.contentOk = contentChecksValid;

      if (checks.errors.length > 0) {
        globalFailures += checks.errors.length;
      }
    } catch (fetchErr) {
      checks.errors.push(`Falha de requisição: ${fetchErr.message}`);
      globalFailures++;
    }

    urlResults.push(checks);
  }

  // ---------------------------------------------------------------------------
  // Apresentação de Resultados em Tabela
  // ---------------------------------------------------------------------------
  console.log('\n📊 TABELA DE RESULTADOS POR URL:');
  console.log('-'.repeat(100));

  const tableSummary = urlResults.map((r) => ({
    URL: r.url.length > 30 ? r.url.slice(0, 27) + '...' : r.url,
    'HTTP 200': r.status200 ? 'OK' : 'FALHA',
    Title: r.titleOk ? 'OK' : 'FALHA',
    Description: r.descOk ? 'OK' : 'FALHA',
    Canonical: r.canonicalOk ? 'OK' : 'FALHA',
    Hreflang: r.hreflangOk ? 'OK' : 'FALHA',
    'OG/Twitter': r.ogImageOk ? 'OK' : 'FALHA',
    'JSON-LD': r.jsonLdOk ? 'OK' : 'FALHA',
    H1: r.h1Ok ? 'OK' : 'FALHA',
    Conteúdo: r.contentOk ? 'OK' : 'FALHA',
    Status: r.errors.length === 0 ? '✓ APROVADO' : `❌ ${r.errors.length} ERRO(S)`,
  }));

  console.table(tableSummary);

  // Lista detalhada de erros caso existam
  const failedUrls = urlResults.filter((r) => r.errors.length > 0);
  if (failedUrls.length > 0) {
    console.log('\n❌ DETALHAMENTO DAS FALHAS ENCONTRADAS:');
    failedUrls.forEach((r) => {
      console.log(`\n• Rota: ${r.url}`);
      r.errors.forEach((err) => console.log(`   - ${err}`));
    });
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n' + '='.repeat(80));
  console.log(`⏱️ Tempo total de execução: ${durationSec}s`);
  console.log(`📋 Total de páginas auditadas: ${urlResults.length}`);

  if (globalFailures === 0) {
    console.log('🎉 SUCESSO: Todas as páginas e diretrizes de SEO/Indexação estão 100% em conformidade!');
    console.log('='.repeat(80));
    process.exit(0);
  } else {
    console.error(`💥 ERRO: Foram identificadas ${globalFailures} falha(s) de SEO/Indexação. Correção obrigatória antes da publicação.`);
    console.log('='.repeat(80));
    process.exit(1);
  }
}

run();
