# Base de Conhecimento - Pokédex React

Este diretório reúne as especificações técnicas, padrões de arquitetura e decisões de design implementadas na evolução da aplicação Pokédex.

---

## Sumário dos Artigos Técnicos

| Documento | Título | Escopo & Descrição |
| :--- | :--- | :--- |
| **[01-core-refactor-mvvm.md](./01-core-refactor-mvvm.md)** | Refatoração Core para MVVM | Separação de responsabilidades em Model, ViewModel e View; eliminação de dívidas técnicas e tipagem estrita sem `any`. |
| **[02-pokemon-details-model.md](./02-pokemon-details-model.md)** | Modelagem e Endpoints de Detalhes | Modelagem dos contratos de detalhes, espécies, cadeia evolutiva e estatísticas base consumindo a PokeAPI v2. |
| **[03-design-system-3-tones.md](./03-design-system-3-tones.md)** | Design System: Paleta Hierárquica de 3 Tons | Arquitetura de cores `{ bg, badge, icon }` cobrindo os 18 tipos de Pokémon com contraste WCAG e CSS mask para ícones de tipos. |
| **[04-spa-routing-setup.md](./04-spa-routing-setup.md)** | Roteamento Declarativo SPA com React Router | Configuração do ecossistema de rotas (`/` e `/pokemon/:id`), deep linking e eliminação de acoplamento via `useParams`/`useNavigate`. |
| **[05-url-state-persistence.md](./05-url-state-persistence.md)** | Persistência de Estado e Filtros na URL | Sincronização bidirecional de geração e busca textual via `useSearchParams`, histórico do navegador e deep linking. |
| **[06-grid-layout-and-smooth-transitions.md](./06-grid-layout-and-smooth-transitions.md)** | Layout Estável e Transições Suaves | Eliminação do layout shift entre gerações, `scrollbar-gutter: stable`, container ancorado e grid desktop com 7 cards por linha. |
| **[07-details-visual-polish-and-items.md](./07-details-visual-polish-and-items.md)** | Acabamento Sheet Overlap & Sprites de Itens | Implementação do visual bottom-sheet com sobreposição no cabeçalho e renderização dos sprites oficiais de itens de evolução. |
