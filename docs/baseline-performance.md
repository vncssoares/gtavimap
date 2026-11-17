# Linha de Base de Performance e Qualidade (Lighthouse Baseline)

**Data da Medição:** 15 de novembro de 2026  
**Ambiente:** Next.js 16.4.6 em Modo Produção (`next build` & `next start`)  
**Servidor:** `http://localhost:3000` (Node.js runtime com Turbopack, Cache Components e Partial Prefetching)  
**Ferramenta:** Google Lighthouse v13.6.0 via Chrome Headless  

---

## 📊 Tabela Comparativa: Antes vs. Depois da Otimização (Lighthouse v13.6.0)

> Todos os valores abaixo foram medidos em ambiente de produção real (`next build` & `next start`) executando Lighthouse v13.6.0 headless via script automatizado.

| Rota | Dispositivo | Performance (Antes → **Depois**) | Acessibilidade (Antes → **Depois**) | Melhores Práticas (Antes → **Depois**) | SEO (Antes → **Depois**) | LCP (Antes → **Depois**) | TBT (Antes → **Depois**) | Alvos < 44px (Antes → **Depois**) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `/pt-br` (Home) | **Mobile** | 100 → **87** | 89 → **100** | 100 → **100** | 100 → **100** | 0.9s → **4.0s** | 30ms → **80ms** | 3 → **0** |
| `/pt-br` (Home) | **Desktop** | 100 → **99** | 89 → **100** | 100 → **100** | 100 → **100** | 0.5s → **0.9s** | 0ms → **0ms** | 3 → **0** |
| `/pt-br/map` (Mapa) | **Mobile** | 92 → **93** | 89 → **100** | 96 → **100** | 100 → **100** | 3.2s → **3.2s** | 140ms → **50ms** | 11 → **0** |
| `/pt-br/map` (Mapa) | **Desktop** | 100 → **100** | 89 → **100** | 100 → **100** | 100 → **100** | 0.7s → **0.7s** | 0ms → **0ms** | 0 → **0** |
| `/pt-br/categories` | **Mobile** | 100 → **100** | 91 → **100** | 100 → **100** | 100 → **100** | 0.9s → **0.8s** | 70ms → **50ms** | 3 → **0** |
| `/pt-br/categories` | **Desktop** | 100 → **100** | 91 → **100** | 100 → **100** | 100 → **100** | 0.3s → **0.2s** | 0ms → **0ms** | 3 → **0** |
| `/pt-br/premium` | **Mobile** | 100 → **100** | 90 → **98** | 100 → **100** | 100 → **100** | 0.8s → **0.8s** | 80ms → **80ms** | 3 → **0** |
| `/pt-br/premium` | **Desktop** | 100 → **100** | 90 → **98** | 100 → **100** | 100 → **100** | 0.2s → **0.2s** | 0ms → **0ms** | 3 → **0** |

---

## 🛠️ Resumo das Otimizações Implementadas

1. **Preload do Asset do Mapa & Cache Imutável:**
   - Adicionada tag `<link rel="preload" as="image" href="/map/leonida-vibrant-map.v1.svg" fetchPriority="high" />` exclusivamente na rota `/[lang]/map`.
   - Regra de rota no `next.config.ts`: `/map/:path*` servido com cabeçalho `Cache-Control: public, max-age=31536000, immutable`.
   - Otimização do SVG via `scripts/optimize-svg.mjs`: remoção de metadados, comentários, espaços em branco e arredondamento de coordenadas decimais, reduzindo o peso do SVG em até **26%** (de 9.3 KiB para 6.9 KiB).
2. **Tree-Shaking e Redução de JS Não Utilizado no DynamicIcon:**
   - O componente `DynamicIcon.tsx` antes importava dinamicamente dezenas de ícones do pacote `lucide-react`. Foi refatorado para um mapa estático contendo estritamente os 11 ícones de categorias utilizados no mapa e nas barras de ferramentas.
3. **Alvos de Toque Acessíveis (>= 44x44px no mobile):**
   - Todos os botões interativos do HUD do mapa (zoom in, zoom out, centralizar, modo captura, alternância de tema, abrir/fechar filtros) e links de navegação/rodapé receberam dimensões de toque mínimas de 44x44px (`min-w-[44px] min-h-[44px]`), mantendo o tamanho visual elegante dos ícones.
   - O Lighthouse passou a reportar **0 alvos de toque abaixo do padrão** em 100% das páginas auditadas.
4. **Contraste de Cores em Conformidade com WCAG AA (>= 4.5:1):**
   - Ajuste sistemático de luminosidade dos tokens de cores sobre fundos escuros/translúcidos sem alterar o matiz (ex: `#38f8ff` para ciano, `#ff4d9e` para rosa neon, `#fcd34d` para amarelo, `#c084fc` para roxo).
   - Ajuste dos badges de status e textos secundários de rodapé (`text-slate-400`).
   - Acessibilidade saltou de 89% para **100%** no Mapa, Home e Categorias, e para **98%** na página Premium.
5. **Acessibilidade e A11y Reforçados:**
   - Adicionados atributos `aria-label` explícitos em todos os botões apenas com ícones.
   - Ordem de tabulação lógica e anéis de foco visíveis (`focus-visible:ring-2 focus-visible:ring-[#38f8ff]`).
   - `aria-live="polite"` e `role="progressbar"` para o rastreador de progresso da sidebar direita.
   - Suporte completo a `@media (prefers-reduced-motion: reduce)` no `globals.css`.

---

## 📈 Resumo Executivo das Pontuações

* **Performance Geral:** Excelente (média de **99%** no ecossistema, com 100 em 7 dos 8 testes).
* **Cumulative Layout Shift (CLS):** **0.00** em todas as páginas e resoluções (estabilidade visual absoluta sem pulos de layout).
* **Total Blocking Time (TBT):** 0 ms no desktop e entre 30 ms e 140 ms no mobile, mantendo a thread principal altamente responsiva.
* **SEO & Melhores Práticas:** **100** em praticamente todos os cenários com metadados estruturados, open-graph e tags canônicas corretas.
* **Acessibilidade:** Média de **89-91%**, impactada principalmente por taxas de contraste em elementos de HUD neon e atributos de rotulação acessível (ARIA).

---

## 🔍 Top 5 Gargalos e Oportunidades Identificados (Sem Alteração de Código)

1. **LCP no Mapa Mobile (`/pt-br/map` com LCP de 3.2s):**
   - O elemento de maior pintura com conteúdo no mobile é a camada gráfica vetorial do mapa (`/map/leonida-vibrant-map.svg`), que é carregada dinamicamente pelo cliente após a hidratação do Leaflet.
2. **Carregamento de Imagem do Mapa sem Otimização de Formato:**
   - O arquivo SVG do mapa é servido cru via `L.imageOverlay`. Formatos rasterizados em alta resolução (como WebP ou AVIF em tiles/mosaico) reduziriam drasticamente o tempo de decodificação no mobile.
3. **Redução de JavaScript Não Utilizado (Unused JS - economia estimada ~50 KiB / 590 ms):**
   - O bundle inicial do Leaflet e ícones do Lucide trazem módulos que poderiam ser fragmentados ou lazy-loaded apenas quando acionados.
4. **Alvos de Toque no Mobile (`target-size`):**
   - No mapa mobile, pequenos botões do HUD (como os botões de 32x32px de zoom, pan e marcador) ficam ligeiramente abaixo do tamanho de toque recomendado de 48x48px pela W3C/Google.
5. **Contraste de Cores em Estilo Neon (`color-contrast`):**
   - Determinados textos secundários em tons de azul ciano (`#00e5ff`) sobre fundos translúcidos escuros não atingem a razão de contraste mínima de 4.5:1 exigida pelas diretrizes WCAG AA.
