# 08 - Configuração de CI/CD e Deploy Estático para Vite + React Router no Netlify

## 1. Objetivo & Motivação

Com a adoção do roteamento declarativo em Single Page Application (SPA) através do `react-router-dom` (suporte a deep linking em rotas como `/pokemon/:id`), servidores web e plataformas de hospedagem estática necessitam de regras explícitas de rewrite/fallback.

Sem a configuração adequada de redirecionamento HTTP, qualquer tentativa de recarregar a página (F5) ou acessar diretamente uma URL profunda (ex.: `https://site.netlify.app/pokemon/25`) resultaria em erro **404 Not Found**, pois o servidor tenta localizar fisicamente o arquivo `/pokemon/25` no disco ao invés de servir o `index.html`.

Além disso, para que a pipeline de CI/CD automatizada do Netlify execute o empacotamento da aplicação sem intervenção manual no painel, é fundamental declarar os comandos de build e o diretório de publicação na raiz do repositório.

---

## 2. Arquitetura de Configuração no Netlify

Foram configurados dois mecanismos complementares para assegurar o build correto e o roteamento SPA:

### 2.1 Arquivo Central de Infraestrutura (`netlify.toml`)

Localizado na raiz do repositório, o `netlify.toml` define o ciclo de vida do build e as regras de redirecionamento de borda:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

- **`command = "npm run build"`**: Dispara o script do `package.json`, que executa a checagem de tipos com `tsc` seguida pelo empacotamento otimizado com `vite build`.
- **`publish = "dist"`**: Aponta para o diretório de artefatos estáticos gerados pelo Vite.
- **`[[redirects]]` (Status 200 Rewrite)**: Intercepta qualquer requisição (`/*`) e reescreve internamente para `/index.html` mantendo o status HTTP 200, permitindo que o cliente (`react-router-dom`) assuma o controle da renderização da rota.

### 2.2 Redundância Estática Garantida (`public/_redirects`)

Como estratégia de fallback resiliente para deploys manuais, deploys via CLI (`netlify deploy`) ou variações de interpretação do pipeline do Netlify, foi adicionado o arquivo:

```text
/*    /index.html   200
```

- O Vite copia integralmente o conteúdo da pasta `public/` para a raiz de `dist/` durante o `vite build`.
- Isso garante a presença de `dist/_redirects`, sendo imediatamente reconhecido pelo Netlify mesmo em cenários de deploy de pasta pré-compilada.

---

## 3. Decisões Técnicas & Trade-offs

1. **Status 200 vs 301/302 (Rewrite vs Redirect)**:
   - O uso do status `200` executa um _rewrite_, mantendo a URL visível no navegador do usuário intacta (ex.: `/pokemon/150`), sem disparar um redirecionamento 301/302 que alteraria a barra de endereços para `/index.html`.
2. **Dupla Abordagem (`netlify.toml` + `public/_redirects`)**:
   - `netlify.toml` provê controle de build e deploy no nível do repositório.
   - `public/_redirects` atua como salvaguarda estática embutida no bundle final. Juntas, eliminam qualquer ponto único de falha de configuração de infraestrutura.

---

## 4. Padrões de Validação & Verificação

Para validar a integridade da configuração antes do deploy:

1. **Build Local**:
   ```bash
   npm run build
   ```
   Gera a pasta `dist/` e assegura a compilação do TypeScript e bundling do Vite sem erros.
2. **Verificação dos Artefatos em `dist/`**:
   - `dist/index.html` gerado com sucesso.
   - `dist/_redirects` copiado a partir de `public/_redirects`.
3. **Qualidade de Código e Testes**:
   ```bash
   npm run lint
   npm run test
   ```
   Garante conformidade com o linter e estabilidade da suíte de testes.

---

## 5. Pontos de Atenção para Sessões Futuras

- **Adição de Novas Rotas**: O wildcard `/*` cobre todas as rotas dinâmicas do React Router. Nenhuma regra extra de redirect é necessária ao criar novas páginas na SPA.
- **Headers de Segurança e Cache**: Caso sejam necessárias políticas de CORS, Content-Security-Policy (CSP) ou caching agressivo de assets estáticos (`/assets/*`), elas podem ser centralizadas nas seções `[[headers]]` do `netlify.toml`.
- **Assets Públicos**: Arquivos estáticos colocados em `public/` (como imagens e favicons) continuam sendo servidos diretamente com prioridade antes do rewrite `/*`, preservando o carregamento dos ícones de tipos e SVGs em `/images/`.
