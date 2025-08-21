import * as S from './styles'
import { theme } from '@/styles/theme'
import { LG, SM } from '@/styles/typographStyles'

interface Address {
  id: number;
  cep: string;
  number: string;
  city: string;
  neighborhood: string;
  state: string;
  street: string;
}

interface CardReservedProps {
  id: number;
  name: string;
  address: Address;
  time_start: string;
  time_end: string;
  price: string;
  payment_method: string;
  reserved_date: string;
  onClickEdit: (id: number) => void;
  onClickCancel: (id: number) => void;
}

export function CardReserved({
  id, 
  name,
  address,
  time_start,
  time_end,
  price,
  payment_method,
  reserved_date,
  onClickEdit, 
  onClickCancel
}: CardReservedProps) {
  const formattedAddress = `${address.street}, ${address.number} - ${address.city}, ${address.state}`;
  const dateAndTime = `${reserved_date} ${time_start} - ${time_end}`;

  function formatPriceToNumber(priceString: string) {
    if (!priceString || typeof priceString !== 'string') {
        return 0;
    }
    
    const numericString = priceString.replace(/[^\d,.]/g, '');
    
    if (numericString.includes(',')) {
        return parseFloat(numericString.replace(/\./g, '').replace(',', '.'));
    }
    
    return parseFloat(numericString);
  }

  function formatarMoedaBrasileira(valor: number) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
  }

  return (
      <S.Card>
        <LG color={theme.colors.branco.principal} family={theme.fonts.inter}>
          {name}
        </LG>

        <SM color={theme.colors.branco.secundario} family={theme.fonts.inter}>
          {formattedAddress}
        </SM>

        <SM color={theme.colors.branco.secundario} family={theme.fonts.inter}>
          {dateAndTime}
        </SM>

        <SM color={theme.colors.branco.secundario} family={theme.fonts.inter}>
          Valor: {formatarMoedaBrasileira(formatPriceToNumber(price))} - Pagamento: {payment_method}
        </SM>

        <S.ContainerButton>
          {/* <S.ButtonEdit onClick={() => onClickEdit(id)}>
            <SM family={theme.fonts.inter} color={theme.colors.azul.segundario}>
              Alterar
            </SM> 
          </S.ButtonEdit> */}

          <S.ButtonCancel onClick={() => onClickCancel(id)}>
            <SM family={theme.fonts.inter} color={theme.colors.vermelho}>
              Cancelar
            </SM>
          </S.ButtonCancel>
        </S.ContainerButton>     
      </S.Card>
  )
}