import 'styled-components';

import { ThemeType, TypeColorTokens } from './theme';

export type { TypeColorTokens };

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends ThemeType {}
}
