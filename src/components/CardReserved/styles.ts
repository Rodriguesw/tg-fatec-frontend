import { theme } from '@/styles/theme'
import * as C from '@chakra-ui/react'
import styled from 'styled-components'

export const Container = styled(C.Flex)`
    width: 100%;
    height: calc(100vh - 266.25px);

    gap: 15px;
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
    flex-direction: column;
    align-items: flex-start;
    
    border-radius: 8px;
    border: 2px solid ${theme.colors.verde};

    >p{
        text-align: start;
    }
`