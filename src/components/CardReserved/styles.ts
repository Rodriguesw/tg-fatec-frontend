import { theme } from '@/styles/theme'
import * as C from '@chakra-ui/react'
import styled from 'styled-components'

export const Container = styled(C.Flex)`
    width: 100%;
    height: calc(100vh - 266.25px);

    gap: 15px;
    flex-direction: column;

    overflow-y: auto;
`

export const Card = styled(C.Flex)`
    width: 100%;
    height: auto;
    padding: 12px 8px;

    gap: 6px;
    flex-direction: column;
    align-items: flex-start;
    
    border-radius: 8px;
    border: 2px solid ${theme.colors.verde};

    >p{
        text-align: start;
    }
`