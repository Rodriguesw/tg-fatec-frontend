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
    flex-direction: column;
    align-items: flex-end;
    
    border-radius: 8px;
    border: 2px solid ${theme.colors.verde.principal};
`

export const CardContent = styled(C.Flex)`
    width: 100%;
    height: auto;
   
    gap: 6px;
    
    align-items: center;

    >p{
        text-align: start;
    }
`

export const ContainerUserPhoto = styled(C.Flex)`
    width: auto;
    height: auto;

    align-items: center;
    justify-content: center;

    >img{
        width: 77px;
        height: auto;
    }
`

export const CardContentUserInfo = styled(C.Flex)`
    width: auto;
    height: auto;
   
    gap: 6px;
    flex-direction: column;
    align-items: flex-start;

    >p{
        text-align: start;
    }
`

export const CardContentDataAndHours = styled(C.Flex)`
    width: 100%;
    height: auto;
   
    gap: 6px;
    flex-direction: column;
    align-items: flex-start;
`

export const Button = styled(C.Button)`
    width: auto;
    height: auto;
    padding: 12px 24px;
    
    border-radius: 12px;
    background-color: transparent;
`