import * as S from './styles'
import { theme } from '@/styles/theme'
import { LG, SM } from '@/styles/typographStyles'

export function CardMyProperty({ onEdit }: { onEdit: (item: any) => void }) {
  const getDataMySportsLocations = JSON.parse(localStorage.getItem('currentUserProprietario') || '{}');
  
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
    <S.Container>
      {getDataMySportsLocations.my_sports_location
        .filter((item: any) => item.status !== 'excluido')
        .map((item: any) => (
        <S.Card key={item.id}>
              <S.CardContent>
                <LG color={theme.colors.branco.principal} family={theme.fonts.inter}>
                  {item.name}
                </LG>

                <SM color={theme.colors.branco.secundario} family={theme.fonts.inter}>
                  Tipo de propriedade: {item?.type === 'Futsal' ? 'Quadra Futsal' : item?.type === 'Society' ? 'Campo Society' : 'Campo Futebol'}
                </SM>

                <SM color={theme.colors.branco.secundario} family={theme.fonts.inter}>
                  {item.address.street}, {item.address.number} - {item.address.city}, {item.address.state}
                </SM>

                <SM color={theme.colors.branco.secundario} family={theme.fonts.inter}>
                  {item.days.length > 1 ? "Dias" : "Dia"}: {
                    item.days
                      .map((day: string) => {
                        return { 
                          original: day, 
                          order: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].indexOf(day),
                          display: day
                        };
                      })
                      .sort((a: { order: number }, b: { order: number }) => a.order - b.order)
                      .map((day: { display: string }) => day.display)
                      .join(', ')
                  } <br/> Horários: {item.time_start} às {item.time_end}
                </SM>

                <SM color={theme.colors.branco.secundario} family={theme.fonts.inter}>
                  Valor: {formatarMoedaBrasileira(formatPriceToNumber(item.price))} <br/> Método de pagamento: {item.payment_method}
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