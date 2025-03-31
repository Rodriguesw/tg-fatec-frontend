import styled from "styled-components";
import * as C from '@chakra-ui/react'
import { theme } from "@/styles/theme";

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
    justify-content: flex-start;
    flex-direction: column;

    border-radius: 16px;

    >img{
        width: 100%;
        height: auto;
    }

    >img:nth-child(2){
        position: absolute;
        top: 85px;
        left: 0;

        width: 100%;
        height: auto;
        max-height: 240px;
    }

    >a{
        width: 100%;
        height: auto;
        padding: 8px 16px;

        font-weight: 800;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 8px;
        background-color: #CCCCCC;
    }
`;

export const ContainerLogo = styled(C.Flex)`
    width: 100%;
    height: auto;
    padding: 8px 40px;

    >img{
        width: 100%;
        height: auto;
        max-width: 59px;
    }
`

export const Content = styled(C.Flex)`
    width: 100%;
    height: auto;
    max-width: 479px;
    padding: 24px 24px 40px;

    gap: 24px;
    align-items: center;
    flex-direction: column;
`

export const ContentHeader = styled(C.Flex)`
    width: 100%;
    height: auto;
    
    flex-direction: column;
    align-items: flex-start;
`

export const ContentForm = styled(C.Flex)`
    width: 100%;
    height: auto;

    gap: 16px;
    align-items: center;
    flex-direction: column;
`

export const ContainerButton = styled(C.Flex)`
    width: 100%;
    height: auto;
    padding: 0 0 40px;

    align-items: center;
    justify-content: center;
`

export const Button = styled(C.Button)`
    width: 100%;
    height: auto;
    max-width: 312px;
    padding: 12px 24px;

    border-radius: 12px;
    background-color: ${theme.colors.verde};
`

export const ContentFooter = styled(C.Flex)`
    width: 100%;
    height: auto;

    gap: 16px;
    align-items: center;
    flex-direction: column;
`
