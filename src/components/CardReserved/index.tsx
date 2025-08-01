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
  start_time: string;
  end_time: string;
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
  start_time,
  end_time,
  price,
  payment_method,
  reserved_date,
  onClickEdit, 
  onClickCancel
}: CardReservedProps) {
  console.log("reserved_date ====>>>>", reserved_date)


  
  const formattedAddress = `${address.street}, ${address.number} - ${address.city}, ${address.state}`;
  const dateAndTime = `${reserved_date} ${start_time} - ${end_time}`;

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
          Valor: {price} - Pagamento: {payment_method}
        </SM>

        <S.ContainerButton>
          <S.ButtonEdit onClick={() => onClickEdit(id)}>
            <SM family={theme.fonts.inter} color={theme.colors.azul.segundario}>
              Alterar
            </SM> 
          </S.ButtonEdit>

          <S.ButtonCancel onClick={() => onClickCancel(id)}>
            <SM family={theme.fonts.inter} color={theme.colors.vermelho}>
              Cancelar
            </SM>
          </S.ButtonCancel>
        </S.ContainerButton>     
      </S.Card>
  )
}