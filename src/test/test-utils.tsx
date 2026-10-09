import { render, RenderOptions } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { theme } from '../styles/theme';

export interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: MemoryRouterProps['initialEntries'];
}

export const AllTheProviders = ({
  children,
  initialEntries = ['/'],
}: {
  children: React.ReactNode;
  initialEntries?: MemoryRouterProps['initialEntries'];
}) => {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </MemoryRouter>
  );
};

const customRender = (ui: React.ReactElement, options?: CustomRenderOptions) => {
  const { initialEntries, ...renderOptions } = options || {};

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AllTheProviders initialEntries={initialEntries}>{children}</AllTheProviders>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';
export { customRender as render, customRender as renderWithProviders };
