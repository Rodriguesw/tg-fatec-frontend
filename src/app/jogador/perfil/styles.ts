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
    flex-direction: column;
    justify-content: flex-start;
`;

export const Content = styled(C.Flex)`
    width: 100%;
    height: auto;
    padding: 40px;

    gap: 24px;
    align-items: center;
    flex-direction: column;
    justify-content: flex-start;
`

export const ContainerPhoto = styled(C.Flex)`
    width: 100%;
    height: auto;

    align-items: center;
    justify-content: center;

    >img{
        width: 160px;
        height: auto;
        border-radius: 50%;
    }
`

export const ContainerButtons = styled(C.Flex)`
    width: 100%;
    height: calc(100vh - 441px);

    gap: 24px;
    flex-direction: column;
`

export const Button = styled(C.Button)`
    all: unset;

    width: 100%;
    height: auto;

    display: flex;
    align-items: flex-start;
`