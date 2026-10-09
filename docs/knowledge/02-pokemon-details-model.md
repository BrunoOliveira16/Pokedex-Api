# 02 - Camada de Dados: Modelos e Serviços para Detalhes e Cadeia de Evolução

## 1. Objetivo & Motivação

Como parte do desenvolvimento da tela de detalhes do Pokémon (`feat/pokemon-details-view`), surgiu a necessidade de expandir a camada de domínio para além dos dados básicos do card. Os novos requisitos incluem:

- Apresentação de descrição oficial (_flavor text_) e categoria (_genus_).
- Métricas avançadas: taxas de gênero (macho/fêmea), taxa de captura, felicidade base e grupo de ovos.
- Cadeia de evolução visual e hierárquica (estágios 1, 2 e 3, níveis e itens necessários).

---

## 2. Modelos e Contratos de Domínio (`src/models/pokemon.model.ts`)

### 2.1 Principais Interfaces Criadas

- **`PokemonDetails` (estende `Pokemon`)**:
  Adiciona atributos de espécie e a árvore evolutiva sem quebrar compatibilidade com componentes que já consomem `Pokemon`.

  ```ts
  export interface PokemonDetails extends Pokemon {
    description: string;
    genus: string;
    genderRate: PokemonGenderRate;
    captureRate: number;
    baseHappiness: number;
    growthRate: string;
    eggGroups: string[];
    evolutionChainUrl: string;
    isLegendary: boolean;
    isMythical: boolean;
    evolutionChain?: EvolutionNode;
  }
  ```

- **`EvolutionNode`**:
  Estrutura em árvore que representa a hierarquia evolutiva:

  ```ts
  export interface EvolutionNode {
    id: number;
    name: string;
    photo: string;
    minLevel: number | null;
    trigger: string | null;
    item: string | null;
    evolvesTo: EvolutionNode[];
  }
  ```

- **Tipos Auxiliares**:
  - `PokemonGenderRate`: Representa `maleRate`, `femaleRate` e `isGenderless`.
  - `PokemonSpeciesData`: Consolidação dos dados específicos da espécie.
  - `RawPokeApiSpecies`, `RawEvolutionNode`, `RawEvolutionChainResponse`: Contratos brutos da PokéAPI com tipagem estrita (zero `any`).

---

## 3. Funções Puras de Normalização e Helpers

Todas as transformações de dados da PokéAPI foram isoladas em funções puras para facilitar testes unitários e manutenibilidade:

1. **`extractIdFromUrl(url: string): number`**: Extrai com segurança o ID numérico a partir de URLs da PokéAPI (com ou sem barras finais).
2. **`getPokemonSpriteUrl(id: number): string`**: Monta o link para o sprite oficial em alta definição (`home` sprite), com fallback para `/images/pokeball.svg`.
3. **`formatFlavorText(text: string): string`**: Sanitiza caracteres de controle legados da PokéAPI (`\f`, `\n`, `\r`, `\t`) substituindo por espaços normais.
4. **`calculateGenderRate(genderRate: number): PokemonGenderRate`**: Converte a escala em octetos da API (-1 a 8) em porcentagens exatas de gênero (ex.: 1 octeto = 12.5% fêmea / 87.5% macho; -1 = assexuado).
5. **`mapRawSpeciesToSpeciesData(raw: RawPokeApiSpecies): PokemonSpeciesData`**: Normaliza a espécie selecionando textos e categorias prioritariamente em inglês (`en`).
6. **`mapRawEvolutionChainToEvolutionNode(raw: RawEvolutionChainResponse): EvolutionNode`**: Mapeia recursivamente a árvore evolutiva a partir do nó raiz.
7. **`flattenEvolutionChain(root: EvolutionNode): EvolutionNode[]`**: Helper que planifica a árvore em uma lista linear sequencial, facilitando a renderização em componentes de lista.
8. **`mapRawPokeApiToPokemonDetails(pokemon, rawSpecies, evolutionChain?)`**: Agrega o `Pokemon` base com os dados da espécie e evolução.

---

## 4. Integração HTTP (`src/models/pokeApi.service.ts`)

Três novos métodos assíncronos foram disponibilizados no `pokeApiService`:

- **`getPokemonSpecies(id: string | number): Promise<RawPokeApiSpecies>`**:
  Executa `GET /pokemon-species/{id}`.
- **`getEvolutionChain(url: string): Promise<EvolutionNode>`**:
  Faz o fetch da URL fornecida pela espécie e mapeia para `EvolutionNode`.
- **`getPokemonDetails(id: string | number): Promise<PokemonDetails>`**:
  Executa chamadas paralelas otimizadas (`Promise.all`) para buscar dados do Pokémon e da espécie simultaneamente, e em seguida busca a evolução de forma resiliente (não quebrando o retorno caso a evolução falhe).

---

## 5. Cobertura de Testes Unitários (`src/models/pokemon.model.test.ts`)

Foram implementados 17 testes automatizados cobrindo:

- Extração de ID com URLs válidas, inválidas e sem trailing slash.
- Fallback de sprites para IDs inexistentes ou negativos.
- Limpeza de form feeds e quebras de linha em textos de descrição.
- Casos de borda de cálculo de gênero (assexuado, 12.5%, 50%, 100%).
- Mapeamento completo e resiliência a campos ausentes na espécie.
- Mapeamento hierárquico e planificação de cadeias evolutivas (ex.: Pichu ➔ Pikachu ➔ Raichu).
- Composição final do objeto `PokemonDetails`.

---

## 6. Pontos de Atenção para as Próximas Tasks (UI & ViewModel)

1. **Uso no ViewModel**:
   Para carregar os detalhes de um Pokémon na tela ou modal, utilize diretamente `pokeApiService.getPokemonDetails(id)`.
2. **Cadeia de Evolução Opcional**:
   `evolutionChain` pode ser `undefined` caso o Pokémon não possua evolução ou se houver instabilidade no endpoint; trate essa possibilidade na interface visual.
3. **Exibição Linear de Evolução**:
   Para renderizar os cards ou avatares de evolução em linha na UI, utilize `flattenEvolutionChain(details.evolutionChain)`.
