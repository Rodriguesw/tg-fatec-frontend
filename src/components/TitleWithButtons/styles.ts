import styled from "styled-components";
import * as C from '@chakra-ui/react'

export const Container = styled(C.Flex)`
    width: 100%;
    height:  auto;

    gap: 4px;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
`;

export const ButtonBack = styled(C.Button)`
    all: unset;

    width: 24px;
    height: 24px;

    display: flex;
    align-items: center;
    justify-content: center;
`;  

export const ButtonAdd= styled(C.Button)`
    all: unset;

    width: 29px;
    height: 29px;

    display: flex;
    align-items: center;
    justify-content: center;
`; 

