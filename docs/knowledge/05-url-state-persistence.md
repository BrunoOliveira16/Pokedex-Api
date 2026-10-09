# 05 - Persistência de Estado e Filtros na URL (`useSearchParams`)

## 1. Objetivo & Motivação

Em aplicações web modernas, manter o estado de filtros exclusivamente na memória volátil do componente (React `useState`) resulta em perda de contexto quando o usuário:

- Navega para os detalhes de um item e clica no botão "Voltar" do navegador.
- Compartilha a URL da página com um colega esperando que os mesmos filtros estejam ativos.
- Atualiza a página (F5 / reload).

Para solucionar esse problema, a camada `useHomeViewModel` foi refatorada para sincronizar bidirecionalmente a geração selecionada (`gen`) e o termo de pesquisa textual (`search`) com a query string da URL via hook `useSearchParams` do `react-router-dom`.

---

## 2. Padrão Arquitetural Implementado (`useHomeViewModel.ts`)

### 2.1 Leitura Inicial e Fallback Resiliente

Ao carregar a listagem, o hook avalia a query string:

- **`gen`**: Convertido com segurança pela função pura `parseGenerationParam(param)`. Suporta tanto numerais (`?gen=2`) quanto identificadores de texto (`?gen=gen2` ou `?gen=arceus`). Caso omitido ou inválido, assume a 1ª Geração (`GENERATIONS[0]`).
- **`search`**: Extraído diretamente via `searchParams.get('search') || ''`.

```ts
const [selectedGen, setSelectedGen] = useState<GenerationConfig>(() =>
  parseGenerationParam(searchParams.get('gen'))
);
const [searchQuery, setSearchQuery] = useState<string>(
  () => searchParams.get('search') || ''
);
```

### 2.2 Atualização Fluida da Query String (`setSearchParams`)

- **Atualização na Digitação**: O input de busca atualiza o estado local imediatamente (zero latência na interface) e reflete na URL com `{ replace: true }`, evitando poluir o histórico do navegador a cada tecla digitada:
  ```ts
  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      const nextParams = new URLSearchParams(searchParams);
      if (query.trim()) {
        nextParams.set('search', query);
      } else {
        nextParams.delete('search');
      }
      setSearchParams(nextParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );
  ```
- **Troca de Geração**: Ao selecionar uma nova aba, o parâmetro `gen` é atualizado na URL e a busca textual é limpa, reiniciando o offset de paginação para o lote da nova geração.

### 2.3 Sincronização com Histórico Externo

Efeitos dedicados monitoram mudanças nos parâmetros de URL, assegurando que retrocessos e avanços no histórico do navegador sincronizem o estado da ViewModel em tempo real.

---

## 3. Deep Linking de Busca e Filtros

URLs canônicas agora suportam filtros pré-carregados:

| URL Exemplo           | Estado Inicial Carregado                           |
| --------------------- | -------------------------------------------------- |
| `/`                   | 1ª Geração (offset 0), busca vazia.                |
| `/?gen=2`             | 2ª Geração (offset 151, Chikorita a Celebi).       |
| `/?gen=3&search=char` | 3ª Geração filtrando pokémons contendo "char".     |
| `/?search=pikachu`    | 1ª Geração filtrando exclusivamente por "pikachu". |

---

## 4. Benefícios de UX e Usabilidade

1. **Retorno Perfeito de Detalhes para Home**: Ao explorar os detalhes de um Pokémon (`/pokemon/155`) e clicar em "← Voltar", o usuário retorna exatamente à 2ª Geração com sua busca preservada.
2. **Compartilhamento Direto**: Links enviados a outros usuários preservam o contexto exato da visualização.
3. **Bookmarks**: Usuários podem salvar links diretos para suas gerações favoritas.

---

## 5. Cobertura de Testes Automatizados

1. **`useHomeViewModel.test.ts` (8 testes)**:
   - Funções auxiliares `parseGenerationParam` e `formatGenerationParam`.
   - Inicialização padrão com geração 1 quando query params estão ausentes.
   - Leitura de parâmetros preexistentes na URL (`/?gen=2&search=pikachu`).
   - Atualização síncrona da query string ao buscar e alternar gerações.
   - Paginação em lotes de 35 e tratamento de erro de rede com retry.
2. **`Home.test.tsx` (3 testes)**:
   - Renderização inicial na raiz `/`.
   - Reflexo das abas ativas e valor do input a partir da URL.
   - Filtragem e atualização de resultados em tempo real.
