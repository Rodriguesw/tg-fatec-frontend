import { theme } from '@/styles/theme'
import * as C from '@chakra-ui/react'
import styled from 'styled-components'

export const Container = styled(C.Flex)`
    width: 100%;
    height: auto;

    gap: 16px;
    flex-direction: column;

    overflow-y: auto;

    /* Estilizando a barra de rolagem */
    scrollbar-width: thin; /* Para navegadores compatíveis com CSS padrão */
    scrollbar-color: transparent transparent;

    /* Estilização para navegadores baseados em WebKit */
    ::-webkit-scrollbar {
        width: 1px; /* Largura da barra de rolagem */
    }

    ::-webkit-scrollbar-thumb {
        background-color: transparent; /* Deixa o "polegar" da barra transparente */
    }

    ::-webkit-scrollbar-track {
        background-color: transparent; /* Deixa o fundo da barra transparente */
    }
`

export const Card = styled(C.Flex)`
    width: 100%;
    height: auto;
    padding: 12px 8px;

    gap: 6px;
    align-items: flex-end;
    
    border-radius: 8px;
    border: 2px solid ${theme.colors.verde.principal};
`

export const CardContent = styled(C.Flex)`
    width: 100%;
    height: auto;
   
    gap: 6px;
    flex-direction: column;
    align-items: flex-start;

    >p{
        text-align: start;
    }
`


export const ButtonEdit = styled(C.Button)`
    width: auto;
    height: auto;

    background-color: transparent;
`

export const ContainerDescriptionAndButton = styled(C.Flex)`
    width: 100%;
    height: auto;

    gap: 6px;
    display: flex;
    align-items: flex-end;
    
`

export const ContainerDescription = styled(C.Flex)`
    width: 100%;
    height: auto;

    gap: 6px;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
`

export const ContainerImagesCarrousel = styled(C.Flex)`
    width: 100%;
    height: 150px;
    position: relative;
    border-radius: 8px;
    overflow: hidden;

    border-radius: 16px;
    border: 2px dashed #FFFFFF25;
`

export const ImageCarouselContainer = styled(C.Flex)`
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    transition: transform 0.3s ease;
`

export const ImageCarouselItem = styled(C.Flex)`
    min-width: 100%;
    height: 100%;
    position: relative;
    
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`

export const CarouselButton = styled(C.Button)`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: 8px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 2;
    
    &:first-of-type {
        left: 10px;
    }
    
    &:last-of-type {
        right: 10px;
    }
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.7);
    }
`

export const CarouselDots = styled(C.Flex)`
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    justify-content: center;
    gap: 8px;
`

export const CarouselDot = styled(C.Box)<{ active?: boolean }>`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.active ? theme.colors.laranja : theme.colors.branco.principal};
    cursor: pointer;
    opacity: ${props => props.active ? 1 : 0.5};
    transition: all 0.2s;
    
    &:hover {
        opacity: 0.8;
    }
`