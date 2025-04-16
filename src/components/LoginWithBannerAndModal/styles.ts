import styled from 'styled-components'
import * as C from '@chakra-ui/react'
import { theme } from '@/styles/theme'

interface LogoProps {
    backgroundImage?: string;
    minHeight?: string;
}

export const Container = styled(C.Flex)`
    width: 100%;
    height: 100%;
    max-width: 479px;

    gap: 4px;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
`

export const Logo = styled(C.Flex)<LogoProps>`
    width: 100%;
    height: 100%;
    min-height: ${props => props.minHeight || '560px'};

    align-items: flex-start;
    justify-content: center;

    background-image: url(${props => props.backgroundImage || '/images/jpg/bk-login.jpg'});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    >img{
        width: 100%;
        height: auto;
        max-width: 200px;

        margin-top: 77px;
    }
`

export const Box = styled(C.Flex)`
    top: -65px;
    position: relative;

    width: 100%;
    height: auto;
    max-width: 479px;

    border-radius: 16px 16px 0 0;
    background-color: ${theme.colors.azul.principal};
`
