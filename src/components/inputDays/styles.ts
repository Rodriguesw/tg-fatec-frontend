import styled from 'styled-components'
import * as C from '@chakra-ui/react'

import DatePicker from "react-datepicker"

interface InputContainerProps  {
    $hasError: boolean
}

export const Container = styled(C.Flex)`
    width: auto;
    height: auto;

    gap: 4px;
    flex-direction: column;
    position: relative; 
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

    &[type="time"] {
        &::-webkit-calendar-picker-indicator {
            filter: invert(0.4);
            opacity: 0;
        }

        &::-webkit-clear-button,
        &::-webkit-inner-spin-button {
            display: none;
        }
        
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-image: url('/images/png/icon-timer-white-1.png'); // Substitua pelo seu ícone de relógio
        background-repeat: no-repeat;
        background-position: right 0.5rem center;
        background-size: 1.3rem;
    }

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

export const CustomDatePicker = styled(DatePicker)`
  width: 132px;
  height: 46px;
  padding: 8px 12px;

  font-size: 18px;
  color: #ffffff70;
  border-radius: 12px;
  font-family: "Inter";
  background-color: transparent;
  border: 2px solid #ffffff25;

  &::placeholder {
    color: #ffffff40;
  }

  .react-datepicker {
    font-family: "Inter";
    background-color: #1E1E1E;
    border-radius: 12px;
    border: none;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: #5A4FCF;
    color: white;
  }

  .react-datepicker__day--disabled {
    color: #ffffff25;
  }

  .react-datepicker__header {
    background-color: #292929;
    border-bottom: none;
  }
`