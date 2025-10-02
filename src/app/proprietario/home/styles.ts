import styled from "styled-components";
import * as C from '@chakra-ui/react'
import { theme } from "@/styles/theme";

interface modalProps {
    isLoading?: boolean
}

export const Container = styled(C.Flex)`
    width: 100%;
    height: 100vh;

    overflow-y: auto;
    justify-content: center;

    background-color: #0D1321;
`;

export const Wrapper = styled(C.Flex)`
    width: 100%;
    height: 100%;
    max-width: 479px;       

    align-items: center;
    flex-direction: column;
    justify-content: flex-start;
`;

export const Content = styled(C.Flex)`
    width: 100%;
    height: calc(100% - 11rem);
    padding: 16px;

    gap: 16px;
    align-items: center;
    flex-direction: column;
    justify-content: flex-start;
`

export const ContainerInput = styled(C.Flex)`
    width: 100%;
    height: auto;
    padding: 0 8px;
`

export const ContainerMap = styled(C.Flex)`
    width: 100%;
    height: 100%;

    >iframe{
        border-radius: 6px;
    }
`

export const ContainerModalLocalSport = styled(C.Flex)<modalProps>`
    width: 100%;
    height: auto;
    max-width: 420px;
    padding: 16px 16px 40px;

    gap: 24px;
    align-items: center;
    flex-direction: column;

    border-radius: 16px;
    background-color: ${theme.colors.azul.principal};
`

export const ContainerContentModalLocalSport = styled(C.Flex)`
    width: 100%;
    height: 60vh;

    gap: 24px;
    flex-direction: column;

    overflow-y: auto;

    >div:nth-child(3){
        >div:last-child{
            width: 140px;
        }
    }

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

export const ImageCarouselContainer = styled(C.Flex)`
    width: 100%;
    height: 200px;
    position: relative;

    flex-direction: column;

    border-radius: 8px;
    /* overflow: hidden; */
    background-color: ${theme.colors.azul.principal};
`

export const Containerbuttons = styled(C.Flex)`
    width: 100%;
    height: 200px;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    border-radius: 16px;
    border: 2px dashed #FFFFFF25;
`

export const ImageContainer = styled(C.Flex)`
    width: 100%;
    height: 200px;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    border-radius: 16px;
    border: 2px dashed #FFFFFF25;
`

export const ImagePlaceholder = styled(C.Flex)`
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: ${theme.colors.azul.principal};
    color: ${theme.colors.branco.principal};
    gap: 8px;
`

export const ImageUploadButton = styled(C.Button)`
    background-color: transparent;
    border-radius: 16px;
    border: 2px dashed #FFFFFF25;
    color: ${theme.colors.branco.secundario};

    width: 100%;
    height: 200px;
    padding: 32px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
`

export const CarouselNavigation = styled(C.Flex)`
    /* position: absolute;
    bottom: 1px;
    left: 0;
    right: 0; */
    padding-top: 8px;
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

export const LoadingContainer = styled(C.Flex)`
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
`

export const ContainerWithTwoInputs = styled(C.Flex)`
    width: 100%;
    height: auto;

    gap: 8px;
    align-items: flex-end;

    >div>Select{
        width: 100%;
    }
`

export const Button = styled(C.Button)`
    width: auto;
    height: auto;
    max-width: 312px;
    padding: 12px 24px;
    
    border-radius: 12px;
    background-color: ${theme.colors.verde.principal};
`

export const ContainerNotFoundLocal = styled(C.Flex)`
    width: 100%;
    height: 100%;

    gap: 16px;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    >img{
        width: 100%;
        height: auto;
        max-width: 200px;
    }
`

export const ContainerButtonModalEdit = styled(C.Flex)`
    width: 100%;
    height: auto;

    gap: 16px;
    align-items: center;
    justify-content: center;

    >button{
        width: 100%;
        height: 48px;
        max-width: 112px;
        padding: 8px 4px;

        border-radius: 8px;
    }

    >button:first-child{
        background-color: ${theme.colors.vermelho};
    }

    >button:last-child{
        background-color: ${theme.colors.verde.secundario};
    }
`

export const ContainerModalDelete = styled(C.Flex)`
    width: 360px;
    height: auto;
    padding: 16px;
    
    gap: 16px;
    border-radius: 16px;
    flex-direction: column;

    background-color: #0D1321;
`

export const ContainerModalFormTooltip = styled(C.Flex)`
    width: 100%;
    height: auto;
    max-width: 25px;

    display: flex;
    margin-bottom: 50px;
    flex-direction: column;

    >img{
        width: 17px;
        height: auto;
    }
`