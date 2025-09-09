import { SM } from '@/styles/typographStyles'
import * as S from './styles'
import { useState, useEffect } from 'react'
import { theme } from '@/styles/theme'

interface InputHoursProps {
  id?: string
  value?: string // Formato "HH:00"
  onChange?: (value: string) => void
  hasError?: boolean
  label?: string
  placeholder?: string
  minHour?: number // Hora mínima (0-23)
  maxHour?: number // Hora máxima (0-23)
  isToday?: boolean // Se o dia selecionado é hoje
  disabled?: boolean 
  width?: string
  propertyTimeStart?: string // Horário de início de funcionamento da propriedade
  propertyTimeEnd?: string // Horário de término de funcionamento da propriedade
}

export function InputHours({
  id,
  value = '',
  onChange,
  label, 
  hasError = false,
  minHour = 6,
  maxHour = 22,
  isToday = false,
  placeholder = '00:00',
  disabled = false,
  width,
  propertyTimeStart,
  propertyTimeEnd,
}: InputHoursProps) {
  const [timeValue, setTimeValue] = useState('00:00')

  // Converte o valor do horário para número (ex: "13:00" => 13)
  const getHourAsNumber = (time: string | undefined): number => {
    if (!time) return 0;
    const [hourStr] = time.split(':')
    return parseInt(hourStr, 10)
  }

  // Gera as horas disponíveis com base na lógica do dia atual e horários da propriedade
  const generateHourOptions = () => {
    const now = new Date()
    const currentHour = now.getHours()
    const options = []

    // Determina o horário mínimo considerando o dia atual e o horário de funcionamento da propriedade
    let adjustedMin = minHour
    
    // Se houver um horário de início definido para a propriedade, usamos ele como base
    if (propertyTimeStart) {
      const propertyStartHour = getHourAsNumber(propertyTimeStart)
      adjustedMin = Math.max(adjustedMin, propertyStartHour)
    }

    if (isToday) {
      // Se agora for 20:38 → próxima hora é 21
      const nextAvailableHour = currentHour + 1
      if (nextAvailableHour > adjustedMin) {
        adjustedMin = Math.max(nextAvailableHour, adjustedMin)
      }
    }

    // Determina o horário máximo considerando o horário de funcionamento da propriedade
    let adjustedMax = maxHour
    if (propertyTimeEnd) {
      const propertyEndHour = getHourAsNumber(propertyTimeEnd)
      // Para o horário de início, limitamos ao horário de fechamento da propriedade
      if (id !== 'end-hours') {
        adjustedMax = Math.min(adjustedMax, propertyEndHour)
      } else {
        // Para o horário de término, permitimos até 1 hora após o fechamento
        adjustedMax = Math.min(adjustedMax, propertyEndHour + 1)
      }
    }

    for (let i = adjustedMin; i <= adjustedMax; i++) {
      options.push(`${i.toString().padStart(2, '0')}:00`)
    }

    return options
  }

  const hourOptions = generateHourOptions()

  useEffect(() => {
    if (value && isValidHour(value)) {
      setTimeValue(value)
    } else {
      setTimeValue('') // Não seleciona nenhum valor por padrão
    }
  }, [value, minHour, maxHour, isToday])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setTimeValue(val)
    if (onChange) onChange(val)
  }

  // Valida se está no formato HH:00 e dentro do intervalo
  const isValidHour = (time: string): boolean => {
    if (!/^([01][0-9]|2[0-3]):00$/.test(time)) return false

    const hours = parseInt(time.split(':')[0], 10)
    return hours >= minHour && hours <= maxHour
  }

  return (
    <S.Container width={width}>
      {label && (
        <S.Label>
          <SM family={theme.fonts.inter}>{label}</SM>
        </S.Label>
      )}

      <S.Select
        id={id}
        value={timeValue}
        onChange={handleChange}
        $hasError={hasError}
        disabled={disabled}
      >
        <option value="" disabled hidden>{placeholder}</option>
        {hourOptions.map((hour) => (
          <option key={hour} value={hour}>{hour}</option>
        ))}
      </S.Select>
    </S.Container>
  )
}
