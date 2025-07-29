import styled from 'styled-components'
import * as C from '@chakra-ui/react'

interface InputContainerProps  {
  $hasError: boolean
}

export const Container = styled(C.Flex)<InputContainerProps>`
  width: auto;
  height: auto;

  gap: 4px;
  flex-direction: column;
  position: relative; 

  .input-date {
    width: 132px;
    height: 46px;
    padding: 8px 12px;

    font-size: 18px;
    color: #ffffff70;
    border-radius: 12px;
    font-family: "Inter";
    background-color: transparent;
    border: 2px solid ${props => props.$hasError ? "#D93131" : "#FFFFFF25"};

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
  }
`