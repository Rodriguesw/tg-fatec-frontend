export const theme = {
  colors: {
    azul: '#0D1321',
    verde: '#1E5631',
    laranja: '#E87421',
    branco: {
        principal: '#F5F5F5',
        secundario: '#A1A1AA',
    },
  }
} as const;

export type Theme = typeof theme;
