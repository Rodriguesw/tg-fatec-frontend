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