import * as S from './styles';
import { theme } from '@/styles/theme';
import { LG, MD, SM } from '@/styles/typographStyles';

export function CardMyOrders({ onEdit }: { onEdit?: (item: any) => void }) {
  const getDataCurrentUserProprietario = JSON.parse(localStorage.getItem('currentUserProprietario') || '{}');
  const infoUser = JSON.parse(localStorage.getItem('infoUser') || '{}');

  return (
    <S.Container>
      {(getDataCurrentUserProprietario.orders ?? []).map((order: any) => {
        const reservist = infoUser[order.user_id]; 
        const reservistName = reservist?.name ?? 'Usuário desconhecido';

        return (
          <S.Card key={order.id}>
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
                        {item.reserved_date} - {item.start_time} às {item.end_time}
                    </SM>
                  </S.CardContentDataAndHours>
                ))}
              </S.CardContentUserInfo>
            </S.CardContent>

            <S.ContainerButtonModalEdit>
              <S.Button onClick={() => console.log('Editar pedido')}>
                <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                  Cancelar
                </MD>
              </S.Button>

              <S.Button onClick={() => console.log('Confirmar pedido')}>
                <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                  Confirmar
                </MD>
              </S.Button>
            </S.ContainerButtonModalEdit>
          </S.Card>
        );
      })}
    </S.Container>
  );
}
