# 🗺️ GTAVIMap — Plataforma de Mapa Interativo de GTA VI

> **Protótipo funcional de alta fidelidade** inspirado em ferramentas como RDR2Map e MapGenie, desenvolvido com identidade visual própria (Dark Mode + Verde Neon), arquitetura modular e cartografia customizada baseada em coordenadas cartesianas sem distorções esféricas.

---

## ⚡ Tecnologias Utilizadas

- **Framework Web:** Next.js (App Router, Server & Client Components)
- **Linguagem:** TypeScript (Tipagem estrita para dados, marcadores e estado)
- **Estilização:** Tailwind CSS (Paleta de cores Dark Graphite & Neon Lime)
- **Motor Cartográfico:** Leaflet com projeção plana `L.CRS.Simple` e sobreposição de base cartográfica vetorial de alta definição (2000x2000)
- **Ícones:** Lucide React (Ícones modernos, minimalistas e otimizados)
- **Persistência de Dados:** LocalStorage API com arquitetura desacoplada via `StorageService` e hooks reativos
- **SEO & Otimização:** URLs amigáveis i18n, Sitemap dinâmico, Robots.txt, Open Graph e Tags canônicas
- **Internacionalização (i18n):** 3 idiomas com rotas dedicadas (`/en`, `/pt-br`, `/es`)

---

## 🎯 Funcionalidades Implementadas

### 1. Mapa Interativo Completo
- **Navegação Fluida:** Zoom in/out suave, movimentação por arrasto (mouse ou touch).
- **Projeção de Jogo (`L.CRS.Simple`):** Sistema cartesiano sem distorções geográficas da Terra, com grade militar e coordenadas `X` e `Y` em tempo real.
- **Base Cartográfica Estilizada:** Mapa vetorial rico de Leonida e Vice City com massas de terra, pântanos de Grassrivers, The Vice Keys, pistas do aeroporto e rodovias.
- **Preparado para Expansão:** Arquitetura desacoplada em `src/config/mapConfig.ts` permitindo substituir a base atual por Tiles XYZ oficiais (`/tiles/{z}/{x}/{y}.png`) sem refatorar o restante do código.

### 2. Marcadores e Categorias
- **8 Categorias Catalogadas:**
  1. *Localizações* (Bairros, Centros Urbanos, Praias)
  2. *Lojas e Serviços* (Ammu-Nation, Oficinas de Tunagem, Roupas)
  3. *Veículos* (Superesportivos, Aerobarcos, Helicópteros)
  4. *Armas* (Fuzis de Precisão, SMGs, Pistolas)
  5. *Atividades* (Corridas Noturnas, Derby na Lama, Boates)
  6. *Colecionáveis* (Estátuas de Flamingo Neon, Saltos Únicos, Pacotes Ocultos)
  7. *Missões* (História Demonstrativa, Contratos de Contrabando)
  8. *Pontos de Interesse* (Naufrágios submarinos, Mirantes, Easter Eggs)
- **Transparência Ética:** Marcadores com etiquetas claras de confirmação (*Demonstração Fictícia* ou *Análise de Trailer Oficial*).
- **Copiar Coordenadas:** Botão com 1 clique para copiar `X: {x} | Y: {y}` para a área de transferência.

### 3. Sistema de Progresso do Jogador
- **Marcar como Encontrado:** Altera o status visual no mapa (marcador translúcido com selo de verificação verde).
- **Favoritos:** Destaque dourado com anel de brilho.
- **Anotações Pessoais:** Bloco de anotações persistente por marcador.
- **Barra de Progresso:** Conclusão geral em porcentagem e contadores por categoria em tempo real.
- **Filtros Rápidos:**
  - *Todos*
  - *Não Encontrados*
  - *Apenas Encontrados*
  - *Apenas Favoritos*
- **Backup & Restauração:** Exportação e importação de todo o progresso em formato JSON para transferir entre navegadores.

### 4. Responsividade Mobile First
- **Desktop:** Barra lateral esquerda com filtros e busca; mapa ocupando o espaço central; painel de detalhes fixo à direita.
- **Mobile:** Mapa ocupando 100% da tela; botão de filtros com gatilho ergonômico acessível com o polegar; painel de detalhes em gaveta deslizante.

### 5. Internacionalização (i18n)
- Suporte a 3 idiomas com arquivos de tradução isolados (`src/i18n/translations.ts`):
  - 🇺🇸 **English (en)** — Idioma padrão
  - 🇧🇷 **Português do Brasil (pt-BR)**
  - 🇪🇸 **Español (es)**
- URLs canônicas separadas (`/en/map`, `/pt-br/map`, `/es/map`).
- Seletor de idioma intuitivo na barra superior com troca instantânea de rota.

### 6. Página da Versão Premium
- Apresentação visual da futura assinatura Pro.
- Tabela comparativa e listagem de recursos planejados (Zero anúncios, sincronização na nuvem via banco de dados, mapas de calor, rotas de coleta otimizadas).
- Identificação explícita de recursos em desenvolvimento vs protótipo liberado.
- Sem implementação de cobranças reais nesta fase.

### 7. Política Ética de Dados Verificados & Proteção contra Spoilers
- **Origem Exclusiva e Ética:** Todo e qualquer dado marcado como `verified` provém estritamente de **observação direta e em primeira mão dentro do jogo** após seu lançamento oficial. É categoricamente proibido o uso de vazamentos (*leaks*), ataques cibernéticos, materiais não autorizados ou arquivos obtidos de forma ilegítima antes do lançamento.
- **Validação de Integridade Automatizada:** O comando `npm run validate:data` (`scripts/validate-markers.mjs`) audita o arquivo `src/data/verified/markers.json` garantindo IDs únicos, coordenadas `X`/`Y` no intervalo `[0, 1000]`, slugs únicos em kebab-case por categoria, descrições nos 3 idiomas (`en`, `pt-BR`, `es`), e quando `confirmationStatus: 'verified'`, exige `source` preenchido e data de verificação `verifiedAt` em formato ISO 8601.
- **Modos de Dados (`DATA_MODE`):**
  - `"demo"` (padrão em desenvolvimento): Carrega marcadores de demonstração com aviso visual discreto no mapa.
  - `"verified"` (padrão em produção): Carrega exclusivamente os marcadores verificados em jogo de `src/data/verified/markers.json`.
  - `"both"` (apenas dev): Concatena ambos os conjuntos para auditoria e testes de interface.
- **Proteção Contra Spoilers de História:**
  - Missões recebem `spoiler: true` por padrão.
  - No painel de detalhes, o título e a descrição são protegidos por uma tarja e botão *"Mostrar spoiler"*; o conteúdo só é revelado sob clique explícito do usuário (estado em memória, não persistido).
  - Páginas públicas indexáveis (`/[lang]/map/[category]` e `/[lang]/map/[category]/[slug]`) não expõem descrições com spoiler no HTML para crawlers nem metadados de busca.
- **Ferramenta de Captura de Coordenadas (Dev Tools):**
  - Em ambiente de desenvolvimento (`NODE_ENV !== 'production'` ou `NEXT_PUBLIC_DEV_TOOLS=on`), o mapa oferece o modo *"Capturar Ponto"* que copia com 1 clique a estrutura JSON do marcador pronta para `src/data/verified/markers.json` com `x` e `y` arredondados.
  - Esta ferramenta é removida/desabilitada nos builds de produção.

### 8. Privacidade, Consentimento de Cookies & Notificações DMCA
- **ConsentBanner (Client):** Categorias claras de cookies (*Necessários*, *Medição/Telemetria* e *Marketing*), todas desligadas por padrão (opt-in estrito) e salvas em cookie de 12 meses (`cookie_consent`).
- **Zero Scripts de Terceiros antes do Consentimento:** Nenhum script de análise ou publicidade é baixado ou executado sem aprovação prévia.
- **Páginas Institucionais & Legais Dedicadas:**
  - `/[lang]/privacy`: Política de Privacidade com detalhamento do armazenamento exclusivo no LocalStorage do usuário.
  - `/[lang]/terms`: Termos de Serviço com menção explícita de escopo de pesquisa de fãs, nominative fair use e isenção de garantias.
  - `/[lang]/contact`: Canal para suporte e procedimento formal para **Pedidos de Remoção e Direitos Autorais (DMCA)** com botão mailto estruturado.
- **Componente Reutilizável `FanSiteDisclaimer`:** Selo de projeto de fãs sem afiliação comercial à Rockstar Games ou Take-Two Interactive.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js:** Versão 18.x, 20.x ou 22.x+ instalada.
- **npm** ou **yarn** / **pnpm**.

### Passo a Passo

1. **Acessar a pasta do projeto:**
   ```bash
   cd gtavimap
   ```

2. **Configurar variáveis de ambiente (opcional):**
   Copie `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Variáveis suportadas:
   - `DATA_MODE`: Fonte do dataset de marcadores (`demo`, `verified` ou `both`; padrão: `demo` em dev, `verified` em prod).
   - `NEXT_PUBLIC_DEV_TOOLS`: Habilita a ferramenta de captura de coordenadas no mapa (`on` / `off`).
   - `NEXT_PUBLIC_CONTACT_EMAIL`: E-mail para contato e pedidos de remoção / DMCA (padrão: `contact@gtavimap.com`).
   - `NEXT_PUBLIC_ANALYTICS_SRC`: URL do script de medição/analytics (injetado **apenas com consentimento** explícito do usuário).
   - `NEXT_PUBLIC_ANALYTICS_ID`: Identificador do site/domínio no provedor de métricas (opcional).
   - `SITE_INDEXING`: Controle de indexação de busca (`on` para produção com sitemap ativo; `off` para preview/staging com `noindex, nofollow` e sitemap vazio).

3. **Instalar dependências (caso não tenham sido instaladas):**
   ```bash
   npm install
   ```

4. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acessar no navegador:**
   - Abra [http://localhost:3000](http://localhost:3000)
   - O aplicativo redirecionará automaticamente para o idioma detectado ou para `/en`
   - Para acessar diretamente em português: [http://localhost:3000/pt-br/map](http://localhost:3000/pt-br/map)

6. **Gerar Build de Produção:**
   ```bash
   npm run build
   npm run start
   ```

---

## 📁 Estrutura de Arquivos

```
gtavimap/
├── public/
│   └── map/
│       └── leonida-demo-map.svg    # Imagem cartográfica vetorial de Leonida (2000x2000)
├── src/
│   ├── app/
│   │   ├── [lang]/
│   │   │   ├── page.tsx            # Landing Page / Apresentação
│   │   │   ├── map/page.tsx        # Página do Mapa Interativo
│   │   │   ├── premium/page.tsx    # Página de Assinatura Premium
│   │   │   └── categories/page.tsx # Diretório de Categorias (SEO Hub)
│   │   ├── globals.css             # Estilos globais e customização de tema escuro do Leaflet
│   │   ├── layout.tsx              # Root Layout com metadados e OpenGraph
│   │   ├── page.tsx                # Redirecionamento da raiz para /en
│   │   ├── robots.ts               # Diretivas do robots.txt
│   │   └── sitemap.ts              # Sitemap dinâmico para SEO internacional
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx          # Barra de navegação e menu mobile
│   │   │   ├── Footer.tsx          # Rodapé institucional e avisos legais
│   │   │   ├── LanguageSelector.tsx# Seletor de idioma com retenção de rota
│   │   │   └── DynamicIcon.tsx     # Gerenciador dinâmico de ícones Lucide
│   │   └── map/
│   │       ├── InteractiveMapClient.tsx   # Orquestrador cliente do mapa
│   │       ├── CustomLeafletMap.tsx       # Motor Leaflet CRS.Simple
│   │       ├── CategoryFilterSidebar.tsx  # Barra lateral de filtros e progresso
│   │       └── MarkerDetailPanel.tsx      # Painel de detalhes do marcador
│   ├── config/
│   │   └── mapConfig.ts            # Configurações de camadas e projeção do mapa
│   ├── data/
│   │   ├── categories.ts           # 8 categorias catalogadas
│   │   ├── markers.ts              # Exportador compatível de marcadores
│   │   ├── markerRepository.ts     # Repositório com suporte a DATA_MODE (demo, verified, both)
│   │   ├── markers.demo.ts         # Dataset de demonstração
│   │   └── verified/
│   │       └── markers.json        # Dataset verificado de observações em jogo
│   ├── hooks/
│   │   └── useUserProgress.ts      # Hook reativo de progresso do jogador
│   ├── i18n/
│   │   └── translations.ts         # Dicionários completos em en, pt-BR e es
│   ├── services/
│   │   ├── markerService.ts        # Regras de filtragem e cálculo estatístico
│   │   └── storageService.ts       # Persistência local e export/import de backup
│   └── types/
│       └── index.ts                # Definições de tipos TypeScript
```

---

## 🔮 Próximos Passos Recomendados

1. **Camadas de Tiles Reais:**
   Assim que a base cartográfica do jogo for extraída após o lançamento oficial, gerar tiles com ferramenta como `gdal2tiles` ou `Leaflet.TileLayer` e alterar apenas a URL em `src/config/mapConfig.ts`.
2. **Autenticação de Usuários:**
   Integrar Supabase Auth ou NextAuth.js para sincronizar o progresso dos usuários na nuvem em vez de apenas no navegador.
3. **Integração de Pagamento:**
   Conectar Paddle ou Stripe na rota `/premium` para monetização sem fricção.
4. **Submissão de Marcadores pela Comunidade:**
   Criar um painel de moderação para que os jogadores possam sugerir novos pontos de interesse com capturas de tela.
