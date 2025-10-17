import styled from "styled-components";
import * as C from '@chakra-ui/react'
import { theme } from "@/styles/theme";

export const Container = styled(C.Flex)`
    width: 100%;
    height: auto;

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
    height: calc(100dvh - 176.25px);
    padding: 16px;

    gap: 16px;
    align-items: center;
    flex-direction: column;
    justify-content: flex-start;
`

export const ContainerCards = styled(C.Flex)`
    width: 100%;
    height: 100%;

    gap: 16px;
    align-items: center;
    flex-direction: column;
    justify-content: flex-start;

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

export const NotFoundEvent = styled(C.Flex)`
    width: 100%;
    height: 100%;

    gap: 16px;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    >img{
        width: 100%;
        height: auto;
        max-width: 350px;
    }

    >p{
        width: 100%;
        height: auto;
        max-width: 320px;
    }
`

export const ContainerModalEdit = styled(C.Flex)`
    width: 360px;
    height: auto;
    padding: 16px;
    
    gap: 16px;
    border-radius: 16px;
    flex-direction: column;

    background-color: #0D1321;
`

export const ContainerButtonModalSettings = styled(C.Flex)`
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

export const ModalButton = styled(C.Button)`
    width: 100%;
    height: auto;
    max-width: 312px;
    padding: 12px 24px;
    
    border-radius: 12px;
    background-color: ${theme.colors.vermelho};
`

export const LoadingContainer = styled(C.Flex)`
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
`