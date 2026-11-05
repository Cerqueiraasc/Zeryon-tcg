# Zeryon TCG: nova identidade, tela inicial prática e cadastro rápido — Plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Renomear o app para Zeryon TCG, aplicar a identidade verde-amarela, levar busca e adição para o topo da tela inicial e criar o cadastro em janela rápida, sem perder coleções salvas.

**Architecture:** A lógica de adição, preenchimento e busca vira funções puras e testadas em `src/services/collection.ts`. A interface ganha `Logo`, `QuantityStepper`, `AddCardSheet` e `HomePage`; `App.tsx` continua dono do estado. `src/styles.css` é reescrito com variáveis CSS, e todas as telas herdam o novo visual.

**Tech Stack:** React 19, TypeScript 5.8, Vite 6, Vitest 3, lucide-react. Sem novas dependências no projeto.

**Spec:** `docs/superpowers/specs/2026-11-05-zeryon-visual-e-inicio-design.md`

## Global Constraints

- `storageKey` continua exatamente `minha-colecao:v1`.
- Os valores de `id` do catálogo não mudam.
- Nome: `Zeryon TCG`. Frase: `Seu universo TCG em um só lugar`.
- Cores: `#002776`, `#071a3d`, `#009c3b` (só logo e áreas grandes), `#00843a`, `#ffd21f` (sempre com texto `#002776`), fundo `#f5f7fa`.
- Texto de no mínimo 12 px, com contraste de pelo menos 4,5:1. Alvos de toque de pelo menos 44 px no celular.
- Títulos em Manrope, texto em DM Sans, ícones de `lucide-react`.
- Manter foco visível de teclado e `prefers-reduced-motion`.
- Avisos de dados fictícios, de scanner demonstrativo e de projeto independente permanecem legíveis.
- Interface em português do Brasil. Sem tema escuro, sem mudanças no menu além de rótulos curtos no celular.
- A pasta não é um repositório Git: as tarefas não têm passo de commit. Cada tarefa termina com testes e build passando.

## Review Focus

- Busca com maiúsculas, espaços e sem acento (`" PIKACHU "`, `"ceus"`, `"199/165"`) encontra a carta. Teste na Tarefa 2.
- Quantidade vazia, `0`, `1000` ou `2.5` nunca grava valor inválido; é ajustada para o intervalo de 1 a 999. Teste na Tarefa 2.
- Backup com condição, idioma ou edição fora das opções atuais não quebra a janela: o preenchimento volta ao padrão. Teste na Tarefa 2.
- Valor em iene e nomes longos em 360 px não causam rolagem horizontal. Verificação na Tarefa 6.
- Sem internet, as imagens falham, mas busca, adição e layout continuam funcionando. Verificação na Tarefa 6.

---

### Tarefa 1: Corrigir o catálogo

**Files:**
- Modify: `src/data/catalog.ts`
- Test: `src/data/catalog.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces: `cards` e `sets` com os mesmos nomes e tipos de hoje.

- [ ] **Passo 1: Escrever os testes**

`catalog.test.ts`, com os casos:

- `keeps every saved card id`: `cards.map(c=>c.id)` contém exatamente `sv3pt5-199, sv3pt5-173, sv3pt5-198, sv3pt5-197, swsh7-215, swsh12pt5-GG70, sv3pt5-175, sv3pt5-170, sv3pt5-166, sv3pt5-168, swsh7-218, swsh12pt5-GG35`.
- `uses the verified image and number`: `it.each` com os valores da tabela abaixo, para as 5 cartas corrigidas.
- `matches printed hp and attack`: `it.each` com `hp` e `attack` das 12 cartas da segunda tabela.

- [ ] **Passo 2: Rodar `npx vitest run src/data/catalog.test.ts`.** Esperado: FALHA nas cartas corrigidas.

- [ ] **Passo 3: Atualizar `catalog.ts`**

| `id` | `image` (base `https://images.pokemontcg.io/`) | `number` |
|---|---|---|
| `sv3pt5-198` | `sv3pt5/200_hires.png` | `200/165` |
| `sv3pt5-197` | `sv3pt5/198_hires.png` | `198/165` |
| `sv3pt5-175` | `sv3pt5/188_hires.png` | `188/165` |
| `swsh12pt5-GG70` | `swsh12pt5gg/GG70_hires.png` | `GG70/GG70` |
| `swsh12pt5-GG35` | `swsh12pt5gg/GG35_hires.png` | `GG35/GG70` |

| Carta | `hp` | `attack` |
|---|---|---|
| Charizard ex | 330 | `Vórtice Explosivo · 330` |
| Pikachu | 60 | `Soco Pika · 50` |
| Blastoise ex | 330 | `Canhões Gêmeos · 140×` |
| Venusaur ex | 340 | `Chicote Perigoso · 150` |
| Umbreon VMAX | 310 | `Maxiescuridão · 160` |
| Arceus VSTAR | 280 | `Nova Trindade · 200` |
| Alakazam ex | 310 | `Mão Dimensional · 120` |
| Squirtle | 60 | `Cabeçada · 20` |
| Bulbasaur | 70 | `Semente Sugadora · 20` |
| Charmander | 70 | `Sopro de Fogo Constante · 30` |
| Rayquaza VMAX | 320 | `Maxiexplosão · 20+` |
| Leafeon VSTAR | 260 | `Guarda Folha · 180` |

O dano de Charmander estava pouco legível na conferência. Abra `sv3pt5/168_hires.png` e, se for diferente de 30, corrija também o teste.

- [ ] **Passo 4: Rodar `npm test`.** Esperado: tudo passa.

---

### Tarefa 2: Lógica de adição, preenchimento e busca

**Files:**
- Create: `src/data/options.ts`
- Modify: `src/types/index.ts`, `src/services/collection.ts`
- Test: `src/services/collection.test.ts`

**Interfaces:**
- Produces, em `types`: `type CardDetails = { condition: string; language: string; edition: string }`.
- Produces, em `options.ts`: `conditions`, `languages`, `editions` (arrays de `string`, com os valores do `AddForm` atual) e `defaultDetails: CardDetails` = `Perto de nova`, `Português`, `Normal`.
- Produces, em `collection.ts`:
  - `addEntry(state: CollectionState, cardId: string, quantity: number, details: CardDetails, addedAt: string): CollectionState`
  - `lastDetails(state: CollectionState): CardDetails`
  - `clampQuantity(value: number): number`
  - `searchCards(list: Card[], query: string): Card[]`

- [ ] **Passo 1: Escrever os testes em `collection.test.ts`**

- `keeps the storage key`: `storageKey === 'minha-colecao:v1'`.
- `addEntry appends a new entry`: a entrada nova fica por último, com o `addedAt` recebido.
- `addEntry merges same details and moves to the end`: adicionar A/`Perto de nova`, B/`Jogada`, A/`Perto de nova`. Resultado: 2 entradas, a última é A com quantidade somada e o `addedAt` original.
- `addEntry keeps different details apart`: mesma carta com idioma diferente gera 2 entradas.
- `lastDetails uses the last entry`: no cenário acima, retorna `Perto de nova`.
- `lastDetails defaults when empty`: retorna `defaultDetails`.
- `lastDetails ignores unknown options`: última entrada com condição `Excelente` retorna `defaultDetails`.
- `clampQuantity`: `it.each` `[[NaN,1],[0,1],[-3,1],[2.5,2],[1,1],[999,999],[1000,999]]`.
- `searchCards`: `" PIKACHU "` encontra Pikachu; `"ceus"` encontra as cartas de Céus em Evolução; `"199/165"` encontra Charizard ex; `"rara"` encontra por raridade; `"   "` retorna a lista inteira; `"xyz"` retorna `[]`.

- [ ] **Passo 2: Rodar `npm test`.** Esperado: FALHA, funções inexistentes.

- [ ] **Passo 3: Implementar**

`searchCards` busca em nome, número, raridade e coleção. Normaliza com `trim`, minúsculas e `normalize('NFD')` sem diacríticos. A coleção entra na busca para `"ceus"` funcionar. `lastDetails` só aceita a última entrada se os três valores estiverem nas listas de `options.ts`; caso contrário, retorna `defaultDetails`. `clampQuantity` usa `Math.trunc`.

- [ ] **Passo 4: Rodar `npm test` e `npm run build`.** Esperado: tudo passa.

---

### Tarefa 3: Logo, ícones e renomeação

**Files:**
- Create: `public/brand/zeryon-simbolo.svg`, `public/brand/zeryon-simbolo-pequeno.svg`, `public/brand/zeryon-logo-claro.svg`, `public/brand/zeryon-logo-escuro.svg`, `public/favicon.svg`, `src/components/atoms/Logo.tsx`
- Modify: `index.html`, `package.json`, `package-lock.json`, `.gitignore`, `src/components/templates/AppLayout.tsx`, `src/pages/App.tsx`

**Interfaces:**
- Produces: `Logo({size?: number; variant?: 'full'|'small'; showText?: boolean; showTagline?: boolean; onDark?: boolean})`.

- [ ] **Passo 1: Criar os SVGs**

Partir do `symbol#logo-b` de `.superpowers/brainstorm/53-1793901423/content/logo-opcoes.html`.

- **Pequeno:** sem o retângulo da carta de trás, círculo central com raio 20 e sem a faixa curva se ela perder a leitura em 20 px.
- **Fundo escuro:** contorno branco de `stroke-width` 2 na carta de trás também.
- **Logo completa:** símbolo mais "Zeryon TCG" em Manrope 800, com "Zeryon" em `#002776` e "TCG" em `#00843a`; no fundo escuro, branco e `#ffd21f`.
- **Texto em curvas:** gerar os caminhos com `opentype.js` e `@fontsource/manrope`, instalados em uma pasta temporária **fora do projeto**. Essas dependências não entram no `package.json`.
- **Ids internos:** em `Logo.tsx`, usar `useId` no `clipPath`, porque a logo aparece mais de uma vez na página.

Conferir: renderizar os SVGs em 20, 32 e 48 px e olhar a captura. O círculo central precisa estar reconhecível em 20 px.

- [ ] **Passo 2: Renomear**

- `index.html`: título `Zeryon TCG · Seu universo TCG em um só lugar`, `theme-color` `#002776`, descrição com o novo nome e `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`.
- `package.json`: `"name": "zeryon-tcg"`; atualizar o nome em `package-lock.json` também (`npm install --package-lock-only`).
- `.gitignore`: acrescentar `.superpowers/`.
- `AppLayout`: `Logo` no lugar de `.brand-icon`, com a frase na barra lateral. Trocar "Colecionador Pokémon" por "Colecionador". Trocar "Seu universo Pokémon" por "Seu universo TCG, em um só lugar." e tirar o `Leaf` e o bloco `.sidebar-tip`. No rodapé: `Zeryon TCG é um projeto educacional independente, sem afiliação à The Pokémon Company. Pokémon e as ilustrações das cartas pertencem aos respectivos titulares.`
- `App.tsx`: breadcrumb `SEU UNIVERSO TCG`, selo do perfil `COLECIONADOR` e `a.download='zeryon-tcg-colecao.json'`.

- [ ] **Passo 3: Conferir**

Rodar `npm test` e `npm run build`. Rodar `grep -rin "minha cole\|minha-cole" index.html package.json src`: só podem restar `storageKey`, o `.topbar:before` (removido na Tarefa 4) e o rótulo de página "Minha coleção".

---

### Tarefa 4: Novo visual

**Files:**
- Modify: `src/styles.css` (reescrita), `src/components/templates/AppLayout.tsx`, `src/components/molecules/CardTile.tsx`, `src/components/molecules/StatCard.tsx`, `src/components/organisms/Modal.tsx`
- Create: `src/vite-env.d.ts`
- Test: `src/styles.test.ts`

**Interfaces:**
- Produces: variáveis `--navy`, `--navy-deep`, `--flag-green`, `--green`, `--yellow`, `--bg`, `--surface`, `--text`, `--text-muted`, `--border`, `--radius`, além de `Modal` com a prop `variant?: 'center'|'sheet'` (padrão `center`).

- [ ] **Passo 1: Escrever `styles.test.ts`**

Criar `src/vite-env.d.ts` com `/// <reference types="vite/client" />` e importar `./styles.css?raw` de forma que `tsc` aceite. Casos:

- `never sets text below 12px`: nenhuma declaração `font-size` em `px` abaixo de 12, nem em `rem`/`em` que resulte em menos de 12 px com base 16.
- `meets contrast AA`: função local `contrast(a,b)` (WCAG) com as variáveis lidas do `:root`. Todos os pares ≥ 4,5: `--text`/`--bg`, `--text`/`--surface`, `--text-muted`/`--bg`, `--text-muted`/`--surface`, `--navy`/`--yellow`, `#fff`/`--green`, `#fff`/`--navy`, `--green`/`--surface`.
- `keeps focus and reduced motion`: o CSS contém `:focus-visible` e `prefers-reduced-motion`.
- `does not hardcode the old brand`: o CSS não contém `minha coleção`.

- [ ] **Passo 2: Rodar `npx vitest run src/styles.test.ts`.** Esperado: FALHA.

- [ ] **Passo 3: Reescrever `styles.css`**

Organizar em seções, com um seletor por linha: variáveis, base, layout, componentes, páginas e responsivo. Trocar `html` para `font-size: 16px` e corpo com 14 px, ou equivalente, sem texto abaixo de 12 px. Manter os nomes de classe usados pelas telas que não mudam.

Regras que não estão nas variáveis:

- Item de menu selecionado: fundo verde claro, texto `--green`, peso 700.
- Botão primário: `--yellow` com `--navy`. Botão secundário: `--surface` com borda.
- Cartões: fundo `--surface`, borda fina e menos cores por tipo. Fundos da área da carta podem manter um tom por tipo, com contraste no selo.
- Em `@media (max-width: 680px)`: `+`, coração, itens do menu e botões com altura e largura de pelo menos 44 px; `dialog.sheet` encostado na base, largura total, cantos superiores arredondados, `max-height: 90dvh` e rolagem interna.
- Aviso `.notice` com texto `--text` sobre fundo amarelo claro e borda.
- Em Modal, `variant='sheet'` aplica a classe `sheet` ao `dialog`.

Em `AppLayout`, acrescentar `short` em cada item de `nav` (`Início`, `Coleção`, `Explorar`, `Eventos`, `Perfil`), mostrado no celular no lugar de `label`, e a `Logo` no topo mobile, sem `.topbar:before`. Em 360 px, a frase pode ficar oculta no topo se não couber.

- [ ] **Passo 4: Conferir**

Rodar `npm test` e `npm run build`. Abrir `npm run dev` e olhar visão geral, coleção, explorar, campeonatos, perfil, configurações, detalhes e scanner em 360 e 1280 px. A tela inicial ainda é a antiga; a Tarefa 5 a troca.

---

### Tarefa 5: Tela inicial e janela rápida

**Files:**
- Create: `src/pages/HomePage.tsx`, `src/components/organisms/AddCardSheet.tsx`, `src/components/atoms/QuantityStepper.tsx`
- Modify: `src/pages/App.tsx`, `src/components/molecules/StatCard.tsx`, `src/styles.css`

**Interfaces:**
- Consumes: `addEntry`, `lastDetails`, `clampQuantity`, `searchCards`, `CardDetails`, `conditions`, `languages`, `editions`, Modal `variant`.
- Produces:
  - `AddCardSheet({card, initialDetails, onSubmit}: {card: Card|null; initialDetails: CardDetails; onSubmit: (card: Card, quantity: number, details: CardDetails) => void})`
  - `QuantityStepper({value, onChange}: {value: number; onChange: (n: number) => void})`
  - `HomePage({total, favoritesCount, value, renderTiles, onAdd, onScan}: {total: number; favoritesCount: number; value: string; renderTiles: (list: Card[]) => ReactNode; onAdd: () => void; onScan: () => void})`
  - Em `App`: `type ModalState = {kind:'scan'} | {kind:'add'; card: Card|null} | null`.

- [ ] **Passo 1: Implementar `AddCardSheet` e `QuantityStepper`**

- **Com `card`:** título "Adicionar [nome]", sem busca.
- **Sem `card`:** título "Adicionar carta", campo de busca com `searchCards` e lista de resultados. Tocar em um resultado seleciona a carta e mostra os campos, com opção "Trocar carta". Sem resultado: `Nenhuma carta encontrada.`
- **Campos:** `QuantityStepper`, condição, idioma, edição e botão primário "Adicionar à coleção". O botão fica desativado até haver carta escolhida.
- **Teclado:** botões − e + e os resultados com `type="button"`; Enter na busca não envia o formulário.
- **`QuantityStepper`:** botões − e + e campo numérico, sempre passando por `clampQuantity`. Permite apagar o campo enquanto se digita e ajusta ao sair dele.
- **Aviso:** manter `O cadastro está limitado às 12 cartas do catálogo demonstrativo.`

- [ ] **Passo 2: Implementar `HomePage`**

A estrutura segue a seção "Tela inicial" do spec, com o estado da busca dentro de `HomePage`: campo (`aria-label="Buscar cartas"`, placeholder `Buscar carta por nome ou número`), botões "Adicionar carta" e "Escanear", faixa com total, favoritas e valor ilustrativo, `Valores fictícios para demonstração.` e a seção de cartas.

Busca vazia: título "Cartas em destaque" e `cards.slice(0,4)`. Com texto: título `N cartas encontradas` e resultados. Sem resultado: `Nenhuma carta encontrada.` e botão "Limpar busca".

- [ ] **Passo 3: Ligar em `App.tsx`**

- Remover `AddForm`, o `setQuery(detail.id)` e o bloco `page==='home'` antigo. Limpar imports sem uso.
- `add()` passa a usar `addEntry` com `new Date().toISOString()`, e o aviso continua `[carta] adicionada à coleção`.
- `tiles` passa `onAdd={()=>setModal({kind:'add',card:c})}`.
- "Adicionar carta" em `HomePage` e na coleção, inclusive no estado vazio: `{kind:'add',card:null}`. Em Detalhes: fecha os detalhes e abre `{kind:'add',card:detail}`.
- A janela usa `<Modal variant="sheet">`, com `initialDetails={lastDetails(state)}`. O formulário fica fora do corpo de `App`, para não remontar e perder o que foi digitado.
- Na tela inicial, ocultar o título grande da página: o primeiro elemento visível deve ser a busca. Manter um `<h1>` acessível, como `class="visually-hidden"` com o nome do app.

- [ ] **Passo 4: Conferir**

Rodar `npm test` e `npm run build`. Em `npm run dev`:

1. Buscar "pikachu" na tela inicial, tocar no + e confirmar com 2 cópias: aviso aparece e total sobe 2.
2. Adicionar outra carta como "Jogada": a próxima janela já vem com "Jogada".
3. Abrir "Adicionar carta", buscar, trocar de carta e adicionar.
4. Abrir o scanner, selecionar uma carta e adicionar pelos detalhes.
5. Fechar a janela com Esc, com X e tocando fora: nada é gravado.

---

### Tarefa 6: README e verificação final

**Files:**
- Modify: `README.md`
- Create, fora do projeto: script de verificação com `puppeteer-core` e o Chrome instalado (`C:/Program Files/Google/Chrome/Application/chrome.exe`). Não entra no `package.json`.

- [ ] **Passo 1: Atualizar `README.md`**

Título `# Zeryon TCG`, frase, identidade verde-amarela no lugar de "verde e tons naturais", novos componentes na árvore do Atomic Design, descrição do cadastro em janela rápida e o roteiro de apresentação com o novo fluxo. Manter os limites do MVP e o aviso de independência.

- [ ] **Passo 2: Rodar `npm test` e `npm run build`, e iniciar `npm run preview`.** Esperado: tudo passa.

- [ ] **Passo 3: Verificar no navegador, com o script**

Gravar em `localStorage['minha-colecao:v1']`, antes de abrir o app, uma coleção no formato antigo com `sv3pt5-198` e `swsh12pt5-GG70`, e `currency: 'JPY'`. Depois:

- Em 360, 768 e 1280 px, abrir as 6 páginas, a janela de cadastro e os detalhes. Salvar capturas e afirmar `document.documentElement.scrollWidth <= innerWidth`.
- Afirmar que a coleção antiga aparece e que o total confere.
- Em 360 px, afirmar que `+`, coração e itens do menu medem pelo menos 44 × 44 px.
- Em 360 × 640 px, afirmar que "Adicionar à coleção" fica acessível por rolagem na janela.
- Bloquear as imagens por interceptação: a busca e a adição continuam funcionando, sem rolagem horizontal.
- Afirmar que nenhuma carta exibe o verso, comparando as 12 imagens em uma captura conjunta.

- [ ] **Passo 4: Olhar as capturas**

Conferir cada captura com os esboços de `caminhos.html` e `adicionar.html`. Corrigir o que estiver errado e repetir os Passos 2 e 3.

- [ ] **Passo 5: Rodar o roteiro de apresentação do README do início ao fim.** A etapa da câmera precisa de um teste manual em aparelho real, e isso deve ser dito ao autor.
