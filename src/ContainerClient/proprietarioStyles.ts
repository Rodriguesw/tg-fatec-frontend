import styled from "styled-components";
import * as C from '@chakra-ui/react'

export const Container = styled(C.Flex)`
    width: 100%;
    height: 100vh;

    justify-content: center;

    background-color: #BBBBBB;
`;

export const Wrapper = styled(C.Flex)`
    width: 100%;
    height: auto;
    max-width: 600px;

    gap: 24px;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;

    border-radius: 16px;
    background-color: #AAAAAA;

    >a,
    button{
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