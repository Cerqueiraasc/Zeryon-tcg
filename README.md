# Zeryon TCG

**Seu universo TCG em um só lugar.**

MVP educacional em React + TypeScript para colecionadores de cartas Pokémon, preparado para a apresentação de **22 de novembro de 2026**. Interface responsiva, com identidade visual própria em verde, amarelo e azul, inspirada na bandeira do Brasil. A logo fica em `public/brand/`.

## Executar

Requer Node.js 22 ou superior.

```sh
npm install
npm run dev
```

Abra o endereço exibido pelo Vite (normalmente http://localhost:5173).

```sh
npm run build
npm run preview
npm test
```

## O que funciona

### Marketplace e comunidade (demonstração local)

- Acesse **Marketplace** no menu. Explore oito anúncios fictícios de quatro jogadores de exemplo.
- Busque cartas, filtre por coleção e condição, ordene por preço e veja apenas anúncios dos amigos.
- Abra uma oferta e confirme uma **compra simulada**. A oferta deixa de ficar disponível e aparece em **Minhas compras**; não pode ser comprada novamente.
- Publique um anúncio de uma carta do catálogo com preço em reais, condição, idioma, edição e descrição. Gerencie em **Meus anúncios** e retire a oferta quando quiser.
- Abra os perfis dos vendedores ou a aba **Jogadores e amigos** para adicionar ou remover jogadores da lista local. Não há convites enviados nem aceite de outra pessoa.
- Anúncios, amizades e compras são salvos com a coleção e incluídos no backup JSON. Backups antigos continuam compatíveis.

Este módulo não é um marketplace multiusuário real: não tem login, servidor compartilhado, pagamentos, chat, frete ou entrega. Publicar não reserva nem remove uma carta da coleção. Comprar não adiciona uma carta física à coleção. Os anúncios publicados só aparecem neste navegador; outras pessoas e dispositivos não os recebem. Uma versão real exige backend, identidade e integração de compra e venda.

- Tela inicial com busca, botões de adicionar e escanear e totais calculados a partir da coleção real do usuário.
- Catálogo demonstrativo de 12 cartas, em três coleções; busca, filtros por coleção, posse e favoritas e ordenação por nome ou valor.
- Cadastro em janela rápida, com quantidade, condição, idioma e edição já preenchidos pela última adição; remoção pelo detalhe da carta.
- Favoritos independentes da posse, detalhes das cartas e checklist de cartas faltantes.
- Perfil com progresso no **catálogo reduzido**, favoritos e histórico dos registros de adição.
- Persistência local, exportação e restauração de backup JSON validado antes de substituir a coleção.
- Câmera do aparelho com permissão, encerramento da captura ao fechar e seleção manual para simular a identificação.
- Exibição de valores em BRL, USD e JPY com conversão fixa explicitamente demonstrativa.
- Agenda fictícia com informações e resultados de exemplo.

## Atomic Design

```text
src/
  components/
    atoms/       Button, Badge, Logo, QuantityStepper
    molecules/   CardTile, StatCard
    organisms/   Modal, Scanner, AddCardSheet
    templates/   AppLayout
  pages/         App: páginas e composição dos fluxos; HomePage: tela inicial
  data/          Catálogo demonstrativo e opções de cadastro
  services/      Persistência, validação e formatação
  types/         Modelos TypeScript
```

O estado de domínio fica na página principal e é passado por propriedades aos componentes. Não há backend nem autenticação: a coleção pertence ao navegador e dispositivo usados. A restauração de backup substitui os dados locais existentes. A chave `minha-colecao:v1` foi mantida de propósito para preservar as coleções salvas antes da mudança de nome.

## Limites deliberados do MVP

**O scanner não reconhece cartas automaticamente.** A câmera fornece visualização real e o usuário seleciona uma carta para demonstrar a etapa de confirmação. Reconhecimento exige uma integração de visão/OCR e correspondência com um catálogo, com validação de acurácia.

**Preços, conversões e campeonatos são fictícios.** Não há conexão com eBay, Mercado Livre ou outras fontes, histórico de preço nem cálculo por condição/idioma/edição. Não usar os valores como referência de compra ou venda.

O catálogo contém apenas 12 cartas e os progressos se referem a esse recorte, não às coleções oficiais completas. O cadastro manual está limitado a essas cartas. A interface está em português; o idioma da carta é um campo separado. Tradução da interface, login, sincronização e catálogo completo são próximas etapas.

Imagens de cartas são carregadas externamente de `images.pokemontcg.io`; fontes usam Google Fonts com alternativa local do sistema. A exibição das imagens precisa de internet. As ilustrações das cartas estão em inglês e não mudam conforme o idioma cadastrado.

## Roteiro para apresentar

1. Abra a tela inicial e explique o objetivo do aplicativo.
2. Busque uma carta na tela inicial, toque no + e confirme na janela rápida.
3. Toque em "Adicionar carta", busque outra e cadastre duas cópias com idioma e condição.
4. Confira os totais na tela inicial e filtre a sua coleção.
5. Marque uma favorita e mostre o checklist de faltantes e o perfil.
6. Abra o scanner, permita a câmera e explique a identificação demonstrativa.
7. Mude a moeda nas configurações, exporte o backup e recarregue para mostrar persistência.

A câmera requer `localhost` ou HTTPS. Acesso por IP da rede local em HTTP no celular pode bloquear a câmera. Verifique a conexão e as permissões antes da apresentação. Zeryon TCG é um projeto independente, sem afiliação à The Pokémon Company; marcas e ilustrações pertencem aos seus respectivos titulares.
