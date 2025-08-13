import styled from 'styled-components'
import * as C from '@chakra-ui/react'

interface InputContainerProps  {
    width?: string
    $hasError?: boolean
}

export const Container = styled(C.Flex)<InputContainerProps>`
    width: ${props => props.width ? props.width : 'auto'};
    height: auto;

    gap: 4px;
    flex-direction: column;
    position: relative; 
`

export const Label = styled(C.Flex)`
    width: 100%;
    height: auto;

    padding-left: 12px;
    >p{
        color: #FFFFFF75;
    }
`

// Componente estilizado para <select>
export const Select = styled.select<InputContainerProps>`
  width: 80px;
  height: 46px;
  padding: 8px 12px;

  border-radius: 12px;
  background-color: transparent;
  border: 2px solid ${props => props.$hasError ? "#D93131" : "#FFFFFF25"};

  color: #FFFFFF70;
  font-family: "Inter";
  font-weight: 400;
  font-size: 18px;
  line-height: auto;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  &:focus {
    outline: none;
    border-color: #FFFFFF70;
  }

  option {
    background-color: #1c1c1c; // Cor de fundo do dropdown
    color: #FFFFFF;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

export const Input = styled(C.Input)<InputContainerProps>`
    height: 46px;
    padding: 8px 12px;
    width: ${props => props.type === 'time' ? '115px' : "175px"};

    border-radius: 12px;
    background-color: transparent;
    border: 2px solid ${props => props.$hasError ? "#D93131" :  "#FFFFFF25"};

    color: ${props => props.value ? '#FFFFFF70' : '#FFFFFF40'};
    font-family: "Inter";
    font-weight: 400;
    font-size: 18px;
    line-height: auto;

    &[type="date"] {
          &::-webkit-calendar-picker-indicator {
            filter: invert(0.4); 
            opacity: 0; 
        }

        &::-moz-calendar-picker-indicator {
            filter: invert(0.8);
            opacity: 0;
        }

        &::-ms-clear {
            color: rgba(255, 255, 255, 0.7);
        }
        
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-image: url('/images/png/icons-calendar.png');
        background-repeat: no-repeat;
        background-position: right 1rem center;
        background-size: 1.25rem;
    }

    

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px transparent inset !important;
        -webkit-text-fill-color: #FFFFFF40 !important;
        transition: background-color 5000s ease-in-out 0s;
    }
`