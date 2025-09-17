import { useState } from "react"
import DatePicker from "react-datepicker"

import { format, getDay } from "date-fns"
import { ptBR } from "date-fns/locale"

import "react-datepicker/dist/react-datepicker.css"

import * as S from "./styles"

interface InputDaysProps {
  hasError?: boolean
  onChange: (value: string) => void
  availableDays?: string[] // Array com os dias disponíveis: ['Seg', 'Ter', etc]
  filterDate?: (date: Date) => boolean // Função adicional para filtrar datas (ex: dias totalmente ocupados)
}

export default function InputDays({ onChange, hasError = false, availableDays, filterDate }: InputDaysProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const today = new Date()

  const handleChange = (date: Date | null) => {
    setSelectedDate(date)

    if (date) {
      const formatted = format(date, "ddMMyyyy") // ex: 29072025
      onChange(formatted)
    }
  }

  // Função para filtrar os dias da semana disponíveis
  const filterAvailableDays = (date: Date) => {
    // Se não houver dias disponíveis especificados, permite todos os dias
    if (!availableDays || availableDays.length === 0) {
      return true
    }

    const dayOfWeek = getDay(date) // 0 = domingo, 1 = segunda, ..., 6 = sábado
    
    // Mapeia os dias da semana para os códigos usados no sistema
    const dayMap: { [key: number]: string } = {
      0: 'Dom', // Domingo
      1: 'Seg', // Segunda
      2: 'Ter', // Terça
      3: 'Qua', // Quarta
      4: 'Qui', // Quinta
      5: 'Sex', // Sexta
      6: 'Sáb'  // Sábado
    }

    // Verifica se o dia da semana está na lista de dias disponíveis
    return availableDays.includes(dayMap[dayOfWeek])
  }
  
  // Função combinada para filtrar datas
  const combinedFilterDate = (date: Date) => {
    // Primeiro verifica se o dia da semana está disponível
    const isDayOfWeekAvailable = filterAvailableDays(date);
    
    // Se o dia da semana não estiver disponível, já retorna falso
    if (!isDayOfWeekAvailable) return false;
    
    // Se houver uma função filterDate adicional, aplica-a também
    if (filterDate) {
      return filterDate(date);
    }
    
    // Se não houver filterDate adicional, retorna o resultado do filtro de dias da semana
    return isDayOfWeekAvailable;
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
        filterDate={combinedFilterDate}
        />
    </S.Container>
  )
}
