/**
 * Utilitário para criptografia de senhas
 */

/**
 * Criptografa uma string usando SHA-256
 * @param text Texto a ser criptografado
 * @returns String criptografada em formato hexadecimal
 */
export async function encryptPassword(text: string): Promise<string> {
  // Converte a string para um array de bytes
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  // Gera o hash SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Converte o buffer para string hexadecimal
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
    
  return hashHex;
}

/**
 * Verifica se uma senha corresponde a um hash
 * @param password Senha em texto plano
 * @param hash Hash armazenado
 * @returns Promise<boolean> indicando se a senha corresponde ao hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await encryptPassword(password);
  return passwordHash === hash;
}