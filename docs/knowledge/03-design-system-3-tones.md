# 03 - Design System: Paleta Hierárquica de 3 Tons para Tipos Pokémon

## 1. Motivação & Contexto

Anteriormente, o tema da aplicação (`theme.colors.types`) mapeava cada tipo de Pokémon para uma única string hexadecimal (`Record<string, string>`). Essa abordagem gerava limitações visuais:

- Fundos de cards ficavam saturados em excesso ou com baixo contraste contra o texto.
- Badges e textos sofriam para manter conformidade WCAG de acessibilidade.
- A ausência de hierarquia cromática impedia criar profundidade entre container, componente e ícone/rótulo.

Para resolver isso, o Design System evoluiu para uma paleta hierárquica estruturada de **3 tons** para todos os **18 tipos de Pokémon**.

---

## 2. Tipagem e Contrato de Tokens (`src/styles/theme.ts` & `src/styles/styled.d.ts`)

### 2.1 Interface `TypeColorTokens`

```ts
export interface TypeColorTokens {
  bg: string;
  badge: string;
  icon: string;
}
```

### 2.2 Extensão do `DefaultTheme`

O `DefaultTheme` do Styled Components estende a tipagem de forma estrita, garantindo autocompletion e checagem de tipos sem uso de `any`:

```ts
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
```

Onde `theme.colors.types` possui a assinatura `Record<string, TypeColorTokens>`.

---

## 3. Papel e Propósito de Cada Nível Cromático

| Nível       | Luminância & Saturação             | Finalidade Visual                                                     | Exemplos de Uso                           |
| ----------- | ---------------------------------- | --------------------------------------------------------------------- | ----------------------------------------- |
| **`bg`**    | Mais suave, aberto e pastel        | Fundos de cards e containers principais sem sobrecarregar a interface | `CardContainer`, `DetailsContainer`       |
| **`badge`** | Intermediário, vibrante e saturado | Destaque e reconhecimento de marca/tipo                               | `StyledBadge`, `BarFill` (ProgressBar)    |
| **`icon`**  | Mais escuro, profundo e fechado    | Contraste elevado (WCAG AA/AAA) para leitura e ícones                 | `StatLabel`, `StatValue`, ícones e bordas |

---

## 4. Tabela de Cores dos 18 Tipos Pokémon

| Tipo         | `bg` (Fundo) | `badge` (Identificador) | `icon` (Texto/Contraste) |
| ------------ | ------------ | ----------------------- | ------------------------ |
| **Normal**   | `#C6C6A7`    | `#9DA07D`               | `#6D6D4E`                |
| **Fire**     | `#F5AC78`    | `#F08030`               | `#AB4E13`                |
| **Water**    | `#9DB7F5`    | `#6890F0`               | `#385DC5`                |
| **Grass**    | `#A7DB8D`    | `#78C850`               | `#4E8234`                |
| **Electric** | `#FAEC92`    | `#F8D030`               | `#A1871F`                |
| **Ice**      | `#BCE6E6`    | `#98D8D8`               | `#4A9999`                |
| **Fighting** | `#DE837E`    | `#C03028`               | `#7D1F1A`                |
| **Poison**   | `#C183C1`    | `#A040A0`               | `#682A68`                |
| **Ground**   | `#EAD699`    | `#D4A82F`               | `#8E6F18`                |
| **Flying**   | `#C6B7F5`    | `#A890F0`               | `#6D52C7`                |
| **Psychic**  | `#FA92B2`    | `#F85888`               | `#A13959`                |
| **Bug**      | `#C6D16E`    | `#A8B820`               | `#6D7815`                |
| **Rock**     | `#D1C17D`    | `#B8A038`               | `#786824`                |
| **Ghost**    | `#A292BC`    | `#705898`               | `#493963`                |
| **Dragon**   | `#A27DFA`    | `#7038F8`               | `#441F9C`                |
| **Dark**     | `#A99A91`    | `#705848`               | `#49392F`                |
| **Steel**    | `#D1D1E0`    | `#B8B8D0`               | `#70708C`                |
| **Fairy**    | `#F4BDC9`    | `#EE99AC`               | `#9B485A`                |

---

## 5. Aplicação nos Componentes do Ecossistema

1. **`Badge` (`src/components/Badge/styled.ts`)**:
   - Consome `theme.colors.types[$type]?.badge`.
2. **`PokemonCard` (`src/views/Home/components/PokemonCard/styled.ts`)**:
   - Consome `theme.colors.types[$mainType]?.bg`.
3. **`DetailsView` (`src/views/Details/styled.ts`)**:
   - Container raiz consome `theme.colors.types[$mainType]?.bg`.
4. **`ProgressBar` (`src/components/ProgressBar/styled.ts`)**:
   - Preenchimento da barra consome `theme.colors.types[$colorType]?.badge`.
   - Rótulos e valores numéricos consomem `theme.colors.types[$colorType]?.icon`.

---

## 6. Cobertura de Testes Automatizados

O arquivo `src/styles/theme.test.ts` valida:

- Existência de todos os 18 tipos Pokémon no tema.
- Formato hexadecimal válido (`#RRGGBB`) em todos os tokens `bg`, `badge` e `icon`.
- Diferenciação estrita de tons (`bg !== badge !== icon`) para cada tipo.
