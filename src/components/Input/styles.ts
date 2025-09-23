import styled from 'styled-components'
import * as C from '@chakra-ui/react'

interface InputContainerProps  {
    hasvalue: string
    $hasError: boolean
}

export const Container = styled(C.Flex)`
    width: 100%;
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

export const Select = styled.select<InputContainerProps >`
    width: 100%;
    height: 46px;
    padding: 8px 12px;

    font-size: 18px;
    font-weight: 400;
    line-height: auto;
    font-family: "Inter";
    color: ${props => props.hasvalue ? "#FFFFFF70" :  "#FFFFFF40"};

    border-radius: 12px;
    background-color: transparent;
    border: 2px solid ${props => props.$hasError ? "#D93131" :  "#FFFFFF25"};

    appearance: none;
    -webkit-appearance: none; 
    -moz-appearance: none; 
    background-image: url("/images/svg/icon-arrow-down.svg");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 20px;

    >option{
        color: #FFFFFF75;
        background-color: #0D1321;
    }

    &:focus{
        outline: none;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px transparent inset !important;
        -webkit-text-fill-color: #FFFFFF40 !important;
        transition: background-color 5000s ease-in-out 0s;
    }

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
`

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

export const IconWrapper = styled.div`
  position: absolute;
  left: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  
  img {
    width: 20px;
    height: 20px;
  }
`;

export const EyeButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  height: 24px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: 20px;
    width: 20px;
  }
`;

export const Input = styled(C.Input)<InputContainerProps & { paddingLeft?: string }>`
    width: 100%;
    height: 46px;
    padding: 8px 12px;
    padding-left: ${props => props.paddingLeft || '12px'};

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
        background-image: url('/images/png/icon-calendar.png');
        background-repeat: no-repeat;
        background-position: right 1rem center;
        background-size: 1.25rem;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px transparent inset !important;
        -webkit-text-fill-color: #FFFFFF70 !important;
        transition: background-color 5000s ease-in-out 0s;
    }
`