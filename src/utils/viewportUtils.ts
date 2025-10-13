/**
 * Utilitário para ajustar a viewport em aplicações PWA
 * Resolve problemas comuns de layout em dispositivos móveis
 */

/**
 * Força o navegador a recalcular a altura da viewport
 * Similar ao comportamento que ocorre quando um modal é aberto
 */
export const adjustViewport = (): void => {
  // Força o navegador a recalcular a altura da viewport
  window.scrollTo(0, 1);
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 0);
};

/**
 * Ajusta a viewport e configura um listener para orientação
 * Útil para garantir que o layout seja recalculado quando o dispositivo é rotacionado
 */
export const setupViewportAdjustment = (): () => void => {
  // Ajusta a viewport inicialmente
  adjustViewport();
  
  // Configura listener para mudanças de orientação
  const handleOrientationChange = () => {
    setTimeout(adjustViewport, 100);
  };
  
  window.addEventListener('orientationchange', handleOrientationChange);
  window.addEventListener('resize', adjustViewport);
  
  // Retorna função para remover os listeners quando necessário
  return () => {
    window.removeEventListener('orientationchange', handleOrientationChange);
    window.removeEventListener('resize', adjustViewport);
  };
};