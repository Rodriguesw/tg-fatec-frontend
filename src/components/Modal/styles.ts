import { theme } from '@/styles/theme'
import * as C from '@chakra-ui/react'
import styled from 'styled-components'

interface modalProps {
    width?: string
}

export const Container = styled(C.Flex)<modalProps>`
    width: ${props => props.width ? props.width : "auto"};
    height: auto;
`

export const ContainerHeader = styled(C.Flex)`
    width: 100%;
    height: auto;
`
