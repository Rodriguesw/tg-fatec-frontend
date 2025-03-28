import styled from 'styled-components'
import * as C from '@chakra-ui/react'

export const Container = styled(C.Flex)`
    width: 100%;
    height: auto;

    gap: 4px;
    flex-direction: column;
`

export const Label = styled(C.Flex)`
    width: 100%;
    height: auto;

    padding-left: 12px;
    >p{
        color: #FFFFFF75;
    }
`

export const Input = styled(C.Input)`
    width: 100%;
    height: 46px;
    padding: 8px 12px;
    
    border-radius: 12px;
    background-color: transparent;
    border: 1px solid #FFFFFF25;
    
    color: #FFFFFF40;
    font-family: "Inter";
    font-weight: 400;
    font-size: 18px;
    line-height: auto;

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px transparent inset !important;
        -webkit-text-fill-color: #FFFFFF40 !important;
        transition: background-color 5000s ease-in-out 0s;
    }
`