import styled from "styled-components";
import * as C from '@chakra-ui/react'
import { theme } from "@/styles/theme";

interface modalProps {
    isLoading?: boolean
}

interface modalReservaProps {
    selected?: boolean;
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
    height: auto;
    max-width: 479px;       

    align-items: center;
    flex-direction: column;
    justify-content: flex-start;
`;

export const Content = styled(C.Flex)`
    width: 100%;
    height: 100%;
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

export const ContainerModalContent = styled(C.Flex)<modalProps>`
    width: ${props => props.isLoading ? "310px" : "100%"};
    height: auto;
    max-width: 360px;
    padding: 16px 16px 40px;

    gap: 24px;
    align-items: center;
    flex-direction: column;

    border-radius: 16px;
    background-color: ${theme.colors.azul.principal};
`

export const ContainerLoading = styled(C.Flex)`
    width: 100%;
    height: auto;

    align-items: center;
    justify-content: center;
`

export const ContainerModalRatingAndAdress = styled(C.Flex)`
    width: 100%;
    height: auto;

    gap: 8px;
    flex-direction: column;

    >p{
        text-align: start;
    }
`

export const ContainerModalReserva = styled(C.Flex)<modalProps>`
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

export const ContainerModalFormPayment = styled(C.Flex)`
    width: 100%;
    height: auto;
    padding: 16px 8px;

    gap: 16px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    border-bottom: 2px solid #FFFFFF40;
`

export const ContainerModalPaymentOptions = styled(C.Flex)`
    width: 100%;
    height: auto;

    gap: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
`

export const ContainerModalPayment = styled(C.Button)<modalReservaProps>`
    all: unset;
    cursor: pointer;

    width: auto;
    height: auto;
    padding: 4px 12px;

    gap: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 5rem;
    border: ${props => props.selected ? `2px solid #2FBB69` : "2px solid #FFFFFF40"};
    background-color: transparent;

    >img{
        width: 30px;
        height: auto;
    }
`

export const ContainerModalFormTooltip = styled(C.Flex)`
    width: 100%;
    height: auto;
    max-width: 25px;

    display: flex;
    flex-direction: column;

    >img{
        width: 16px;
        height: auto;
    }
`

export const ContainerModalFormReserva = styled(C.Flex)`
    width: 100%;
    height: auto;

    gap: 8px;
    display: flex;
    flex-direction: column;
`

export const ContainerModalFormInputs = styled(C.Flex)`
    width: 100%;
    height: auto;

    gap: 8px;
    display: flex;
    align-items: center;
    justify-content: start;
`

export const Button = styled(C.Button)`
    width: auto;
    height: auto;
    max-width: 312px;
    padding: 12px 24px;
    
    border-radius: 12px;
    background-color: ${theme.colors.verde.principal};
`