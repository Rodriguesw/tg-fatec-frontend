export const theme = {
  colors: {
    vermelho: '#CF3F3F',
    azul: '#0D1321',
    verde: {
      principal: '#1E5631',
      secundario: '#40BC40',
    },
    laranja: '#E87421',
    branco: {
        principal: '#F5F5F5',
        secundario: '#A1A1AA',
    },
  },
  fonts: {
    anton: 'var(--font-anton)',
    inter: 'var(--font-inter)',
  } as const,
} as const;

export type Theme = typeof theme;
