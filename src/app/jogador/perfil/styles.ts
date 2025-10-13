import styled from "styled-components";
import * as C from '@chakra-ui/react'
import { theme } from "@/styles/theme";

interface ContainerPhotoProps {
    hasPhoto: boolean;
}

export const Container = styled(C.Flex)`
    width: 100%;
    /* height: 100dvh; */

    overflow-y: auto;
    justify-content: center;

    background-color: #0D1321;
`;

export const Wrapper = styled(C.Flex)`
    width: 100%;
    height: 100%;
    max-width: 479px;       

    align-items: center;
    flex-direction: column;
    justify-content: flex-start;
`;

export const Content = styled(C.Flex)`
    width: 100%;
    /* height: calc(100dvh - 176px); */
    padding: 40px;

    gap: 24px;
    align-items: center;
    flex-direction: column;
    justify-content: flex-start;
`

export const ContainerPhoto = styled(C.Flex)<ContainerPhotoProps>`
    width: 100%;
    height: auto;
    position: relative;

    align-items: center;
    justify-content: center;

    >img{
        width: 160px;
        height: 160px;
        padding: ${props => props.hasPhoto ? '0' : '10px'};
        
        border-radius: 50%;
        object-fit: cover;

        border: 2px solid ${theme.colors.branco.secundario};
    }
`

export const PhotoButtonsContainer = styled(C.Flex)`
    position: absolute;
    bottom: 0;
    right: calc(50% - 80px);
    display: flex;
    gap: 8px;
`

export const PhotoButton = styled(C.Button)`
    width: 32px;
    height: 32px;
    min-width: 32px;
    border-radius: 50%;
    border: 1px solid ${theme.colors.branco.secundario};
    background-color: ${theme.colors.azul.principal};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    
    > img {
        width: 16px;
        height: 16px;
        fill: #fff;
    }
`

export const ContainerButtons = styled(C.Flex)`
    width: 100%;
    /* height: calc(100dvh - 441px); */

    gap: 24px;
    flex-direction: column;
`

export const Button = styled(C.Button)`
    all: unset;

    width: 100%;
    height: auto;

    display: flex;
    align-items: flex-start;
`

export const ContainerModalEdit = styled(C.Flex)`
    width: 360px;
    height: auto;
    padding: 16px;
    
    gap: 16px;
    border-radius: 16px;
    flex-direction: column;

    background-color: #0D1321;
`

export const ContainerButtonModalRegister = styled(C.Flex)`
    width: 100%;
    height: auto;

    gap: 16px;
    align-items: center;
    justify-content: center;

    >button{
        width: 100%;
        height: 48px;
        max-width: 112px;
        padding: 8px 4px;

        border-radius: 8px;
    }

    >button:first-child{
        background-color: ${theme.colors.vermelho};
    }

    >button:last-child{
        background-color: ${theme.colors.verde.secundario};
    }
`

export const ContainerButtonModalSettings = styled(C.Flex)`
    width: 100%;
    height: auto;

    gap: 16px;
    align-items: center;
    justify-content: center;

    >button{
        width: 100%;
        height: 48px;
        max-width: 112px;
        padding: 8px 4px;

        border-radius: 8px;
    }

    >button:first-child{
        background-color: ${theme.colors.vermelho};
    }

    >button:last-child{
        background-color: ${theme.colors.verde.secundario};
    }
`

export const ModalButton = styled(C.Button)`
    width: 100%;
    height: auto;
    max-width: 312px;
    padding: 12px 24px;
    
    border-radius: 12px;
    background-color: ${theme.colors.vermelho};
`

export const EditorControls = styled(C.Flex)`
    width: 100%;
    flex-direction: column;
    gap: 16px;
    margin-top: 16px;
`

export const ControlGroup = styled(C.Flex)`
    width: 100%;
    flex-direction: column;
    gap: 8px;
`

export const ControlLabel = styled.label`
    color: ${theme.colors.branco.principal};
    font-family: ${theme.fonts.inter};
    font-size: 14px;
`

export const RangeInput = styled.input`
    width: 100%;
    height: 4px;
    border: 1px solid ${theme.colors.azul.principal};
    background: ${theme.colors.azul.principal};
    border-radius: 4px;
    /* -webkit-appearance: none; */
    
    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: ${theme.colors.branco.principal};
        cursor: pointer;
    }
    
    &::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: ${theme.colors.branco.principal};
        cursor: pointer;
        border: none;
    }
`