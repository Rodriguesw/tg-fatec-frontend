import { PinInput } from "@chakra-ui/react"

import * as S from './styles';

export const InputPin = () => {
  return (
    <S.Container>
      <PinInput.Root>
        <PinInput.HiddenInput />

        <PinInput.Control display="flex" gap="8px">
          <PinInput.Input index={0} />

          <PinInput.Input index={1} />

          <PinInput.Input index={2} />

          <PinInput.Input index={3} />
        </PinInput.Control>
      </PinInput.Root>
    </S.Container>
  )
}
