import styled from "styled-components";
import * as C from '@chakra-ui/react'
import { theme } from "@/styles/theme";

interface modalProps {
    isLoading?: boolean
}

interface modalReservaProps {
    selected?: boolean;
    hasError?: boolean
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

export const ContentWithLoading = styled(C.Flex)`
    width: 100%;
    height: 100%;
    padding: 16px;

    gap: 16px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
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

    gap: 8px;
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
    /* align-items: center; */
    justify-content: center;

    align-items: flex-end;
`

export const ContainerDisablePix = styled(C.Flex)`
    width: auto;
    height: auto;

    display: flex;
    align-items: center;
    flex-direction: column;

    >p{
        font-size: 10px;
        line-height: 12px;
    }
`

export const ContainerPix = styled(C.Flex)`
    width: auto;
    height: auto;

    display: flex;
    align-items: center;
    flex-direction: column;
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
    border: ${props => props.hasError ? `2px solid #D93131` : props.selected ? `2px solid #2FBB69` : "2px solid #FFFFFF40"};
    background-color: transparent;

    >p{
        white-space: nowrap;
    }

    >img{
        width: 30px;
        height: auto;
    }

     &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
`

export const ContainerModalFormTooltip = styled(C.Flex)`
    width: 100%;
    height: auto;
    max-width: 25px;

    display: flex;
    flex-direction: column;

    >img{
        width: 17px;
        height: auto;
    }
`

export const ContainerModalFormReserva = styled(C.Flex)`
    width: 100%;
    height: auto;

    gap: 8px;
    display: flex;
    align-items: center;
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
    width: 100%;
    height: auto;
    max-width: 312px;
    padding: 12px 24px;
    
    border-radius: 12px;
    background-color: ${theme.colors.verde.principal};
`;

export const ButtonConfirm = styled(C.Button)`
    width: auto;
    height: auto;
    max-width: 312px;
    padding: 12px 24px;
    
    border-radius: 12px;
    background-color: ${theme.colors.verde.secundario};
`;

export const ButtonSecondary = styled(Button)`
    background-color: ${theme.colors.vermelho};
`;

export const ContainerButtonsAvaliacao = styled(C.Flex)`
    width: 100%;
    
    gap: 8px;
`;

export const ContainerModalPaymentQrCode= styled(C.Flex)`
    width: auto;
    height: auto;
    padding: 8px;

    display: flex;
    align-items: center;
    justify-content: start;

    border-radius: 12px;
    background-color: ${theme.colors.branco.principal};
`