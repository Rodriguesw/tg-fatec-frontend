import styled from "styled-components";
import * as C from '@chakra-ui/react'
import { theme } from "@/styles/theme";

interface ButtonProps {
    active?: boolean;
  }

export const Container = styled(C.Flex)`
    width: 100%;
    height: auto;
`

export const Wrapper = styled(C.Flex)`
    width: 100%;
    height: auto;
    padding: 12px 16px 24px;

    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    border-radius: 16px 16px 0 0;
    background-color: #00000033; 
`

export const Button = styled(C.Button)<ButtonProps>`
    all: unset;
    width: auto;
    height: auto;

    display: flex;
    align-items: center;
    flex-direction: column;

    >img{
        width: 40px;
        height: auto;

        opacity: ${props => props.active ? '1' : '0.5'};
    }

    >p{
        opacity: ${props => props.active ? '1' : '0.5'};
        font-weight: ${props => props.active ? 700 : 400};
    }
`