"use client"

import type { IconButtonProps } from "@chakra-ui/react"
import { IconButton } from "@chakra-ui/react"
import * as React from "react"
import { LuSun } from "react-icons/lu"

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  return <div className="light">{children}</div> // Define o tema fixo como claro
}

export function useColorModeValue<T>(light: T, _: T) {
  return light // Sempre retorna o valor do tema claro
}

export function ColorModeIcon() {
  return <LuSun /> // Ícone fixo para modo claro
}

interface ColorModeButtonProps extends Omit<IconButtonProps, "aria-label"> {}

export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  return (
    <IconButton
      variant="ghost"
      aria-label="Color mode is fixed to light"
      size="sm"
      ref={ref}
      {...props}
      css={{
        _icon: {
          width: "5",
          height: "5",
        },
      }}
    >
      <ColorModeIcon />
    </IconButton>
  )
})
