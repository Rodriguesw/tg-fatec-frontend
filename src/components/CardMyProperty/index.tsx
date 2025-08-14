import * as S from './styles'
import { theme } from '@/styles/theme'
import { LG, SM } from '@/styles/typographStyles'

export function CardMyProperty({ onEdit }: { onEdit: (item: any) => void }) {
  const getDataMySportsLocations = JSON.parse(localStorage.getItem('currentUserProprietario') || '{}');
  return (
    <S.Container>
      {getDataMySportsLocations.my_sports_location.map((item: any) => (
        <S.Card key={item.id}>
              <S.CardContent>
                <LG color={theme.colors.branco.principal} family={theme.fonts.inter}>
                  {item.name}
                </LG>

                <SM color={theme.colors.branco.secundario} family={theme.fonts.inter}>
                  {item.address.street}, {item.address.number} - {item.address.city}, {item.address.state}
                </SM>

                <SM color={theme.colors.branco.secundario} family={theme.fonts.inter}>
                  Dias: {item.days.join(', ')} <br/> Horários: {item.start_time} às {item.end_time}
                </SM>

                <SM color={theme.colors.branco.secundario} family={theme.fonts.inter}>
                  Valor: {item.price} <br/> Método de pagamento: {item.payment_method}
                </SM>
              </S.CardContent>

              <S.ButtonEdit onClick={() => onEdit(item)}>
                <img src="/images/svg/icon-pen.svg" alt="Editar"/>
              </S.ButtonEdit>    
        </S.Card>
        ))}   
    </S.Container>
  )
}