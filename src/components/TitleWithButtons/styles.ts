import styled from "styled-components";
import * as C from '@chakra-ui/react'

interface ContainerProps {
    hasButtonAdd?: boolean;
}

export const Container = styled(C.Flex)<ContainerProps>`
    width: 100%;
    height:  auto;

    gap: 4px;
    align-items: center;
    flex-direction: row;
    justify-content: ${props => props.hasButtonAdd ? 'space-between' : 'flex-start'};
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

