import styled from 'styled-components'
import * as C from '@chakra-ui/react'

interface ContainerProps {
    backgroundImage?: string;
}

export const Container = styled(C.Flex)<ContainerProps>`
    width: 100vw;
    height: 100vh;

    align-items: center;
    flex-direction: column;

    background-image: url(${props => props.backgroundImage || '/images/jpg/bk-login.jpg'});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
`

export const Logo = styled(C.Flex)`
    width: 100%;
    height: auto;
    max-width: 200px;

    margin-top: 85px;
    align-items: center;
    justify-content: center;

    >img{
        width: 100%;
        height: auto;
    }
`
