// services/apiCEP.ts

export interface CEPData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export const fetchCEP = async (cep: string): Promise<CEPData> => {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    
    if (!response.ok) {
      throw new Error('CEP não encontrado');
    }

    const data: CEPData = await response.json();

    return data;
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    throw error; // Rejeita a promise para tratamento no componente
  }
};