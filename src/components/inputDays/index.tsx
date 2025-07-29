import { useState } from "react"
import DatePicker from "react-datepicker"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import "react-datepicker/dist/react-datepicker.css"

import * as S from "./styles"

interface InputDaysProps {
  hasError?: boolean
  onChange: (value: string) => void
}

export default function InputDays({ onChange, hasError = false }: InputDaysProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const today = new Date()

  const handleChange = (date: Date | null) => {
    setSelectedDate(date)

    if (date) {
      const formatted = format(date, "ddMMyyyy") // ex: 29072025
      onChange(formatted)
    }
  }

  return (
    <S.Container $hasError={hasError}>
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        minDate={today}
        dateFormat="dd/MM/yyyy"
        placeholderText="00/00/0000"
        className="input-date"
        locale={ptBR}
        />
    </S.Container>
  )
}
