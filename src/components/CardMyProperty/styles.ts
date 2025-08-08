import { theme } from '@/styles/theme'
import * as C from '@chakra-ui/react'
import styled from 'styled-components'

export const Card = styled(C.Flex)`
    width: 100%;
    height: auto;
    padding: 12px 8px;

    gap: 6px;
    align-items: flex-end;
    
    border-radius: 8px;
    border: 2px solid ${theme.colors.verde.principal};
`

export const CardContent = styled(C.Flex)`
    width: 100%;
    height: auto;
   
    gap: 6px;
    flex-direction: column;
    align-items: flex-start;

    >p{
        text-align: start;
    }
`


export const ButtonEdit = styled(C.Button)`
    width: auto;
    height: auto;

    background-color: transparent;
`