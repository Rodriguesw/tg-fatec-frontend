import * as S from './styles'
import { theme } from '@/styles/theme'
import { LG, SM } from '@/styles/typographStyles'
import { useState, useEffect } from 'react'

export function CardMyProperty({ onEdit }: { onEdit: (item: any) => void }) {
  // Estado para controlar qual imagem está sendo exibida em cada card
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{[key: string]: number}>({});
  const [mySportsLocations, setMySportsLocations] = useState<any[]>([]);
  
  // Inicializa os índices de imagem para cada propriedade quando o componente é montado
  useEffect(() => {
    // Obter dados do localStorage apenas uma vez na montagem do componente
    const userData = JSON.parse(localStorage.getItem('currentUserProprietario') || '{}');
    const locations = userData.my_sports_location || [];
    setMySportsLocations(locations);
    
    // Inicializar os índices de imagem
    if (locations && locations.length > 0) {
      const initialIndexes = locations
        .filter((item: any) => item.status !== 'excluido' && item.id)
        .reduce((acc: {[key: string]: number}, item: any) => {
          acc[item.id] = 0; // Inicializa cada propriedade com índice 0
          return acc;
        }, {});
      
      setCurrentImageIndexes(initialIndexes);
    }
  }, []); // Dependência vazia para executar apenas na montagem
  
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
  
  // Função para navegar para a imagem anterior
  const handlePrevImage = (itemId: string, imagesLength: number) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [itemId]: prev[itemId] === 0 ? imagesLength - 1 : prev[itemId] - 1
    }));
  };
  
  // Função para navegar para a próxima imagem
  const handleNextImage = (itemId: string, imagesLength: number) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [itemId]: prev[itemId] === imagesLength - 1 ? 0 : prev[itemId] + 1
    }));
  };
  
  // Função para ir diretamente para uma imagem específica
  const goToImage = (itemId: string, index: number) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [itemId]: index
    }));
  };

  return (
    <S.Container>
      {mySportsLocations
        .filter((item: any) => item.status !== 'excluido')
        .map((item: any) => (
        <S.Card key={item.id}>
              <S.CardContent>
                <S.ContainerImagesCarrousel>
                  {item.images && item.images.length > 0 ? (
                    <>
                      <S.ImageCarouselContainer
                        style={{ 
                          transform: `translateX(-${currentImageIndexes[item.id] || 0}00%)` 
                        }}
                      >
                        {item.images.map((image: string, index: number) => (
                          <S.ImageCarouselItem key={index}>
                            <img src={image} alt={`Imagem ${index}`} />
                          </S.ImageCarouselItem>
                        ))}
                      </S.ImageCarouselContainer>
                      
                      {item.images.length > 1 && (
                        <>
                          <S.CarouselButton onClick={() => handlePrevImage(item.id, item.images.length)}>
                            &lt;
                          </S.CarouselButton>
                          <S.CarouselButton onClick={() => handleNextImage(item.id, item.images.length)}>
                            &gt;
                          </S.CarouselButton>
                          
                          {/* Indicadores de posição */}
                          <S.CarouselDots>
                            {item.images.map((_: string, index: number) => (
                              <S.CarouselDot 
                                key={index} 
                                active={index === (currentImageIndexes[item.id] || 0) ? true : false}
                                onClick={() => goToImage(item.id, index)}
                              />
                            ))}
                          </S.CarouselDots>
                        </>
                      )}
                    </>
                  ) : (
                    <S.ImageCarouselItem>
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.colors.azul.principal,
                        color: theme.colors.branco.principal
                      }}>
                        Sem imagens disponíveis
                      </div>
                    </S.ImageCarouselItem>
                  )}
                </S.ContainerImagesCarrousel>
                      
                <S.ContainerDescriptionAndButton>
                  <S.ContainerDescription>
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
                            const dayMap: { [key: string]: string } = {
                              'Dom': 'Domingo',
                              'Seg': 'Segunda',
                              'Ter': 'Terça',
                              'Qua': 'Quarta',
                              'Qui': 'Quinta',
                              'Sex': 'Sexta',
                              'Sáb': 'Sábado'
                            };
                            
                            return { 
                              original: day, 
                              order: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].indexOf(day),
                              display: dayMap[day] || day // Fallback caso não encontre
                            };
                          })
                          .sort((a: { order: number }, b: { order: number }) => a.order - b.order)
                          .map((day: { display: string }) => day.display)
                          .join(', ')
                      }
                    </SM>

                    <SM color={theme.colors.branco.secundario} family={theme.fonts.inter}>
                      Horários: {item.time_start} / {item.time_end}
                    </SM>

                    <SM color={theme.colors.branco.secundario} family={theme.fonts.inter}>
                      Valor por hora: {formatarMoedaBrasileira(formatPriceToNumber(item.price))}  
                    </SM>

                    <SM color={theme.colors.branco.secundario} family={theme.fonts.inter}>
                      Método de pagamento: {item.payment_method === 'Dinheiro' ? 'No local' : item.payment_method}
                    </SM>
                  </S.ContainerDescription>
              
                  <S.ButtonEdit onClick={() => onEdit(item)}>
                    <img src="/images/svg/icon-pen.svg" alt="Editar"/>
                  </S.ButtonEdit>
                </S.ContainerDescriptionAndButton>
              </S.CardContent>
        </S.Card>
        ))}   
    </S.Container>
  )
}