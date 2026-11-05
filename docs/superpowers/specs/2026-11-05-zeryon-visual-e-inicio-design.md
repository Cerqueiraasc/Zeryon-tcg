# Zeryon TCG: nova identidade, tela inicial prática e cadastro rápido

Data: 2026-11-05 · Apresentação do MVP: 22/11/2026

## Intenção

O app "Minha Coleção" passa a se chamar **Zeryon TCG**. Ao abrir o app, a pessoa deve sentir **praticidade**: consultar uma carta ou adicionar uma nova à coleção, sem procurar. A identidade visual deve remeter ao Brasil.

Hoje, a tela inicial abre com um banner de marca sem busca. O botão + adiciona a carta sem perguntar os detalhes, e o cadastro completo usa uma lista suspensa sem busca. Muitos textos têm de 7 a 10 px, com pouco contraste.

## Objetivos

1. Aplicar nome, frase e logo novos em todo o app.
2. Aplicar um novo visual a todas as telas, legível no celular e no computador.
3. Levar consulta e adição para o topo da tela inicial.
4. Fazer o botão + abrir uma janela rápida de cadastro.
5. Corrigir as cartas do catálogo que mostram a imagem errada.

## Fora do escopo

- Reorganizar o menu ou unir início, coleção e catálogo (caminho 3, que pode vir depois).
- Reconhecimento real no scanner, preços reais, login, backend, tradução da interface ou catálogo maior.
- Tema escuro no app.

## O que não pode acontecer

- A coleção de quem já usa o app se perder com a renomeação ou a correção do catálogo.
- Os avisos de dados fictícios ou de scanner demonstrativo sumirem ou ficarem difíceis de ler.
- A logo usar o logotipo oficial "Pokémon" ou ilustrações da franquia.
- O app parecer produto oficial da The Pokémon Company: o aviso de projeto independente continua no rodapé e no README.

## Caminhos considerados

| Caminho | Compromisso |
|---|---|
| 1. Só visual novo | Rápido e seguro, mas não melhora consultar nem adicionar. |
| **2. Visual novo e início prático (escolhido)** | Resolve as duas tarefas principais sem mudar a navegação. Dá mais trabalho que o 1. |
| 3. Reforma completa | É o mais prático no dia a dia, mas mexe em quase tudo e aumenta o risco até a apresentação. |

O autor do projeto escolheu o caminho 2.

## Decisões do autor do projeto

- **Nome:** Zeryon TCG.
- **Frase:** "Seu universo TCG em um só lugar".
- **Logo:** opção B, Carta-Bandeira. É uma carta com a bandeira do Brasil, cujo círculo azul lembra uma Pokébola.
- **Botão +:** opção B, janela rápida. Abre com os detalhes preenchidos, e um segundo toque confirma.
- **Tarefas prioritárias:** consultar cartas e adicionar uma carta nova.

Referências visuais em `.superpowers/brainstorm/53-1793901423/content/`: `logo-opcoes.html` (opção B), `caminhos.html` (caminho 2) e `adicionar.html` (opção B). São esboços: valem pela estrutura, e os textos e tamanhos reais seguem este documento.

## Decisões técnicas e de design do redator

O autor pode rever qualquer uma ao ler este documento.

### Logo

- Partir do SVG `logo-b` de `logo-opcoes.html`.
- Criar uma versão para tamanhos pequenos, sem a carta de trás e com o círculo central maior, usada até 32 px e no favicon.
- Em fundo escuro, usar contorno branco para a logo não se perder.
- Entregar em `public/brand/`: símbolo, símbolo pequeno e logo completa para fundo claro e escuro, em SVG, com o texto convertido em curvas. Incluir também um favicon.
- No app, usar um componente `Logo` em `src/components/atoms/`.

### Visual

| Uso | Cor |
|---|---|
| Azul-marinho (texto principal, faixas) | `#002776` |
| Azul-noite (fundos escuros) | `#071a3d` |
| Verde da bandeira (só na logo e em áreas grandes) | `#009c3b` |
| Verde de interface (ações, seleção, texto) | `#00843a` |
| Amarelo (ação principal, destaques) | `#ffd21f`, sempre com texto azul-marinho |
| Fundo da página | `#f5f7fa` |

- O verde e o azul predominam, e o amarelo fica reservado para destaques.
- Texto de no mínimo 12 px, com contraste de pelo menos 4,5:1 (WCAG AA) em todos os tamanhos de texto. Isso vale também para os avisos.
- Alvos de toque de pelo menos 44 px no celular, incluindo o + e o coração das cartas. Os esboços mostram botões menores, mas esta regra prevalece.
- Manter Manrope nos títulos e DM Sans no texto, e `lucide-react` nos ícones.
- Reescrever `src/styles.css`, hoje compactado em poucas linhas, de forma organizada e com as cores e tamanhos em variáveis CSS.
- Manter o foco visível de teclado e o respeito a `prefers-reduced-motion`.

### Tela inicial

De cima para baixo:

1. Campo de busca em destaque.
2. Botões "Adicionar carta" (amarelo) e "Escanear".
3. Faixa compacta com total de cartas, favoritas e valor ilustrativo, indicando que os valores são fictícios.
4. "Cartas em destaque": as 4 primeiras cartas do catálogo.

Regras:

- Ao digitar, a seção de destaque dá lugar aos resultados na própria tela, buscando nas 12 cartas por nome, número e raridade. Se não houver resultado, mostrar uma mensagem e uma forma de limpar a busca.
- Saem da tela inicial o banner, os dois blocos inferiores ("Qual coleção você vai completar?" e a frase decorativa) e o contador "Coleções iniciadas".
- A frase da marca fica junto da logo: na barra lateral no computador e no topo no celular, se couber sem prejudicar a leitura.

### Cadastro rápido

- O + de uma carta abre a janela com a carta já escolhida. Em "Detalhes da carta", "Adicionar à coleção" faz o mesmo.
- "Adicionar carta" abre a janela com um campo de busca para escolher a carta, e depois mostra os mesmos campos. Substitui a lista suspensa atual, inclusive na página "Minha coleção".
- Campos: quantidade (botões − e +, de 1 a 999), condição, idioma e edição.
- Preenchimento: usa os valores do último item de `state.entries`, sem alterar o formato salvo. Sem adições anteriores, usa "Perto de nova", "Português" e "Normal". A quantidade sempre começa em 1.
- Ao confirmar: fecha a janela e mostra o aviso "[carta] adicionada". Mantém a regra atual de somar cópias com os mesmos detalhes.
- Ao somar cópias, mover o registro para o fim de `state.entries` e manter seu `addedAt`. Assim, o preenchimento reflete a última adição sem alterar as datas do histórico, que é ordenado por `addedAt`.
- Aparência: painel que sobe da base da tela no celular e janela central no computador, reaproveitando `Modal`.
- Tirar o `setQuery(detail.id)` do fluxo de detalhes, que hoje usa o texto da busca para passar a carta escolhida.

### Demais telas

Coleção, Explorar, Campeonatos, Perfil, Configurações, Scanner e Detalhes mantêm estrutura e comportamento e recebem o novo visual. Exceção: a página "Minha coleção" e os detalhes usam o novo cadastro.

### Renomeação

- Trocar o nome em `index.html` (título, descrição e `theme-color`), `package.json`, `AppLayout`, `App`, `styles.css` e `README.md`. O README também deve descrever a nova identidade.
- O nome do backup passa a ser `zeryon-tcg-colecao.json`.
- **Manter `storageKey` como `minha-colecao:v1`:** alterá-la faria a coleção salva sumir.
- Textos da marca passam a falar em TCG ("Seu universo TCG"; "Colecionador" no lugar de "Colecionador Pokémon"). O catálogo continua sendo de cartas Pokémon, e o aviso de independência permanece.

### Catálogo

Cinco das 12 cartas mostram a imagem errada (conferido visualmente em 05/11/2026):

| `id` | Nome no catálogo | O que aparece |
|---|---|---|
| `sv3pt5-198` | Blastoise ex | Venusaur ex |
| `sv3pt5-197` | Venusaur ex | Giovanni's Charisma |
| `sv3pt5-175` | Alakazam ex | Psyduck |
| `swsh12pt5-GG70` | Arceus VSTAR | Verso da carta |
| `swsh12pt5-GG35` | Leafeon VSTAR | Verso da carta |

Imagens corretas, também conferidas visualmente em 05/11/2026 (base: `https://images.pokemontcg.io/`):

| `id` (não muda) | Imagem | Número |
|---|---|---|
| `sv3pt5-198` (Blastoise ex) | `sv3pt5/200_hires.png` | 200/165 |
| `sv3pt5-197` (Venusaur ex) | `sv3pt5/198_hires.png` | 198/165 |
| `sv3pt5-175` (Alakazam ex, "Ultra rara") | `sv3pt5/188_hires.png` | 188/165 |
| `swsh12pt5-GG70` (Arceus VSTAR) | `swsh12pt5gg/GG70_hires.png` | GG70/GG70 |
| `swsh12pt5-GG35` (Leafeon VSTAR) | `swsh12pt5gg/GG35_hires.png` | GG35/GG70 |

- **Manter os valores de `id`,** porque são eles que ligam as cartas às coleções salvas. Alguns deixarão de coincidir com o número da carta, e isso é esperado. Nenhuma carta precisa ser substituída.
- Conferir PS e ataque das 12 cartas com a imagem:
  - Corrigir todos os valores de PS e dano divergentes. Por exemplo, Pikachu aparece com "Choque do Coração · 30", mas a arte mostra Pika Punch · 50.
  - Manter os nomes em português que traduzem corretamente o ataque impresso. Traduzir os nomes corrigidos.
  - `attack` continua mostrando um único ataque, o principal da carta.

## Restrições

- React 19, TypeScript e Vite, com Atomic Design conforme o README. Sem novas dependências, salvo necessidade clara.
- Sem backend. Os dados continuam em `localStorage`, e backups existentes continuam válidos.
- Tudo pronto e conferido com folga antes de 22/11/2026.

## Como saber que está pronto

- `npm test` e `npm run build` passam. Hoje, os 8 testes passam.
- Novos testes cobrem o preenchimento pela adição mais recente e a soma de cópias.
- Uma coleção salva antes da mudança continua aparecendo depois dela.
- Conferência visual de todas as telas e da janela de cadastro em 360, 768 e 1280 px, sem rolagem horizontal.
- As 12 cartas exibem a imagem certa.
- Não restam ocorrências de "Minha Coleção" como nome do produto. A chave de armazenamento e a expressão "minha coleção" como rótulo da página são exceções.
- O roteiro de apresentação do README funciona do início ao fim e reflete o novo fluxo.

## Fica a critério de quem construir

- Espaçamentos, raios, sombras e animações, dentro das regras acima.
- Divisão interna dos componentes, como extrair páginas de `App.tsx`, desde que não atrase a entrega.
- Quais textos secundários manter nas demais telas, sem remover avisos de dados fictícios.
