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
}: InputHoursProps) {
  const [timeValue, setTimeValue] = useState('00:00')

  // Gera as horas disponíveis com base na lógica do dia atual
  const generateHourOptions = () => {
    const now = new Date()
    const currentHour = now.getHours()
    const options = []

    let adjustedMin = minHour

    if (isToday) {
      // Se agora for 20:38 → próxima hora é 21
      const nextAvailableHour = currentHour + 1
      if (nextAvailableHour > minHour) {
        adjustedMin = Math.max(nextAvailableHour, minHour)
      }
    }

    for (let i = adjustedMin; i <= maxHour; i++) {
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
