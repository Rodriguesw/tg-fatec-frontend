import * as S from './styles';
import { theme } from '@/styles/theme';
import { LG, MD, SM } from '@/styles/typographStyles';

export function CardReservedProperty({ order, onDelete }: { order: any; onDelete: (id: number) => void }) {
  const infoUser = JSON.parse(localStorage.getItem('infoUser') || '{}');
  const reservist = infoUser[order.user_id]; 
  const reservistName = reservist?.name ?? 'Usuário desconhecido';

  // Verificar se order tem as informações completas ou se precisamos buscar do reservist
  let locationName = order.name || 'Local não especificado';
  let reservedDate = order.reserved_date || 'Data não especificada';
  let timeStart = order.time_start || '';
  let timeEnd = order.time_end || '';
  
  // Para o primeiro tipo de objeto de reserva (que não tem name diretamente)
  if (!order.name && order.my_sports_location_id) {
    // Tentar encontrar a quadra correspondente nas reservas do usuário
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

  return (
    <S.Card>
      <S.CardContent>
        <S.ContainerUserPhoto>
          {reservist?.photo ? (
            <img src={reservist?.photo} alt="Foto do usuário"/>
          ) : (
            <img src="/images/png/user-photo.png" alt="Foto do usuário"/>
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
