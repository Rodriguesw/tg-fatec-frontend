import * as S from './styles';
import { theme } from '@/styles/theme';
import { LG, MD, SM } from '@/styles/typographStyles';

export function CardReservedProperty({ order, onDelete }: { order: any; onDelete: (id: number) => void }) {
  // Buscar informações do usuário do currentUserProprietario e infoUser como fallback
  const currentUserProprietario = JSON.parse(localStorage.getItem('currentUserProprietario') || '{}');
  const infoUser = JSON.parse(localStorage.getItem('infoUser') || '{}');
  
  // Buscar o usuário que fez a reserva
  const reservist = infoUser[order.user_id];
  const reservistName = reservist?.name ?? 'Usuário desconhecido';

  // Verificar se order tem as informações completas ou se precisamos buscar das reservas do proprietário
  let locationName = order.name || 'Local não especificado';
  let reservedDate = order.reserved_date || 'Data não especificada';
  let timeStart = order.time_start || '';
  let timeEnd = order.time_end || '';
  let price = order.price || '';
  let payment_method = order.payment_method || '';
  
  // Para o primeiro tipo de objeto de reserva (que não tem name diretamente)
  if (!order.name && order.my_sports_location_id) {
    // Primeiro, tentar encontrar a quadra correspondente nas reservas do proprietário
    const matchingReservation = currentUserProprietario.reservations?.find(
      (res: any) => res.id === order.id
    );
    
    if (matchingReservation) {
      locationName = matchingReservation.name;
      reservedDate = matchingReservation.reserved_date;
      timeStart = matchingReservation.time_start;
      timeEnd = matchingReservation.time_end;
      price = matchingReservation.price;
      payment_method = matchingReservation.payment_method;
    } else {
      // Fallback: tentar encontrar a quadra correspondente nas reservas do usuário
      const matchingLocation = reservist?.reserved_sports_location?.find(
        (loc: any) => loc.id === order.my_sports_location_id
      );
      
      if (matchingLocation) {
        locationName = matchingLocation.name;
        // Formatar a data se estiver em formato ISO
        if (order.reserved_date && order.reserved_date.includes('-')) {
          const [year, month, day] = order.reserved_date.split('-');
          reservedDate = `${day}/${month}/${year}`;
        }
      }
    }
  }

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
      <S.CardContent>
        <S.ContainerUserPhoto>
          {reservist?.photo ? (
            <img src={reservist?.photo} alt="Foto do usuário"/>
          ) : (
            <img src="/images/svg/icon-user.svg" alt="Foto do usuário"/>
          )}
        </S.ContainerUserPhoto>

        <S.CardContentUserInfo>
          <LG color={theme.colors.branco.principal} family={theme.fonts.inter}>
            {reservistName}
          </LG>

          <S.CardContentDataAndHours>
            <SM color={theme.colors.branco.secundario} family={theme.fonts.inter}>
                {locationName}
            </SM>

            <SM color={theme.colors.branco.secundario} family={theme.fonts.inter}>
                {reservedDate} - {timeStart} às {timeEnd}
            </SM>

            <SM color={theme.colors.branco.secundario} family={theme.fonts.inter}>
                Valor: {formatarMoedaBrasileira(formatPriceToNumber(price))} - Pagamento: {payment_method === 'Dinheiro' ? 'No local' : payment_method}
            </SM>
          </S.CardContentDataAndHours>
        </S.CardContentUserInfo>
      </S.CardContent>

      <S.Button onClick={() => onDelete(order.id)}>
        <MD color={theme.colors.vermelho} family={theme.fonts.inter}>
          Cancelar
        </MD>
      </S.Button>
    </S.Card>
  );
}
