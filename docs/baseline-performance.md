# Linha de Base de Performance e Qualidade (Lighthouse Baseline)

**Data da Medição:** 15 de novembro de 2026  
**Ambiente:** Next.js 16.4.6 em Modo Produção (`next build` & `next start`)  
**Servidor:** `http://localhost:3000` (Node.js runtime com Turbopack, Cache Components e Partial Prefetching)  
**Ferramenta:** Google Lighthouse v13.6.0 via Chrome Headless  

---

## 📊 Tabela de Métricas por Endpoint

| Rota | Viewport / Dispositivo | Performance | Acessibilidade | Melhores Práticas | SEO | LCP | CLS | TBT |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `/pt-br` (Home) | **Mobile** | **100** | 89 | 100 | 100 | 0.9 s | 0 | 30 ms |
| `/pt-br` (Home) | **Desktop** | **100** | 89 | 100 | 100 | 0.5 s | 0 | 0 ms |
| `/pt-br/map` (Mapa) | **Mobile** | **92** | 89 | 96 | 100 | 3.2 s | 0 | 140 ms |
| `/pt-br/map` (Mapa) | **Desktop** | **100** | 89 | 100 | 100 | 0.7 s | 0 | 0 ms |
| `/pt-br/categories` (Categorias) | **Mobile** | **100** | 91 | 100 | 100 | 0.9 s | 0 | 70 ms |
| `/pt-br/categories` (Categorias) | **Desktop** | **100** | 91 | 100 | 100 | 0.3 s | 0 | 0 ms |
| `/pt-br/premium` (Premium) | **Mobile** | **100** | 90 | 100 | 100 | 0.8 s | 0 | 80 ms |
| `/pt-br/premium` (Premium) | **Desktop** | **100** | 90 | 100 | 100 | 0.2 s | 0 | 0 ms |

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
