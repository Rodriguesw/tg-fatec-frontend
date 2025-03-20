import styled from "styled-components";
import * as C from '@chakra-ui/react'
import { theme } from "@/styles/theme";

export const Container = styled(C.Flex)`
    width: 100%;
    height: auto;
`

export const Wrapper = styled(C.Flex)`
    width: 100%;
    height: auto;
    padding: 8px 40px;

    display: flex;
    align-items: flex-end;
    justify-content: space-between;
`

export const Button = styled(C.Button)`
    width: auto;
    height: auto;
`