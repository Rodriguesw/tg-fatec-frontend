import styled from "styled-components";
import * as C from '@chakra-ui/react'
import { theme } from "@/styles/theme";

export const Container = styled(C.Flex)`
    width: 100%;
    height: 100dvh;

    overflow-y: auto;
    justify-content: center;

    background-color: #0D1321;
`;

export const Wrapper = styled(C.Flex)`
    width: 100%;
    height: 100%;
    max-width: 479px;       

    gap: 24px;
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

export const Content = styled(C.Flex)`
    width: 100%;
    height: auto;
    max-width: 479px;
    padding: 80px 24px 160px 24px;

    gap: 40px;
    align-items: center;
    flex-direction: column;
`

export const ContentHeader = styled(C.Flex)`
    width: 100%;
    height: auto;
    
    flex-direction: column;
    align-items: flex-start;
`

export const ContentButtons = styled(C.Flex)`
    width: 100%;
    height: auto;

    gap: 16px;
    flex-direction: column;

    >a{
        width: 100%;
        height: auto;
        padding: 8px 16px;

        border-radius: 12px;

        background-color: ${theme.colors.verde.principal};
    }
`

export const Button = styled(C.Button)`
    width: 100%;
    height: auto;
    padding: 12px 24px;

    border-radius: 12px;
    background-color: ${theme.colors.verde.principal};
`