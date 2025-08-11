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
    height: auto;

    gap: 24px;
    flex-direction: column;

    >div:nth-child(2){
        >div:last-child{
            width: 140px;
        }
    }
`

export const ContainerWithTwoInputs = styled(C.Flex)`
    width: 100%;
    height: auto;

    gap: 8px;
    align-items: flex-end;
`

export const Button = styled(C.Button)`
    width: auto;
    height: auto;
    max-width: 312px;
    padding: 12px 24px;
    
    border-radius: 12px;
    background-color: ${theme.colors.verde.principal};
`