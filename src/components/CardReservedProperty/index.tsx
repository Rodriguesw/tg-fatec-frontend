import * as S from './styles';
import { theme } from '@/styles/theme';
import { LG, MD, SM } from '@/styles/typographStyles';

export function CardReservedProperty({ order, onDelete }: { order: any; onDelete: (id: number) => void }) {
  const infoUser = JSON.parse(localStorage.getItem('infoUser') || '{}');
  const reservist = infoUser[order.user_id]; 
  const reservistName = reservist?.name ?? 'Usuário desconhecido';

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

          {reservist?.reserved_sports_location?.map((item: any) => (
            <S.CardContentDataAndHours key={item.id}>
              <SM color={theme.colors.branco.secundario} family={theme.fonts.inter}>
                  {item.name}
              </SM>

              <SM color={theme.colors.branco.secundario} family={theme.fonts.inter}>
                  {item.reserved_date} - {item.time_start} às {item.time_end}
              </SM>
            </S.CardContentDataAndHours>
          ))}
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
