"use client";

import { Portal, Select, createListCollection } from "@chakra-ui/react";

interface WeekdayMultiSelectProps {
  hasError?: boolean;
  onChange: (values: string[]) => void;
  value?: string[]; 
}

export const WeekdayMultiSelect = ({ 
  hasError = false, 
  onChange,
  value = [] 
}: WeekdayMultiSelectProps) => {
  return (
    <Select.Root
      multiple
      collection={weekdays}
      size="sm"
      width="320px"
      value={value} 
      onValueChange={(details) => onChange(details.value)}
    >
      <Select.HiddenSelect />

      <Select.Label 
        color="#FFFFFF75" 
        fontFamily={"Inter"} 
        fontSize={'16px'} 
        paddingLeft={'12px'}
      >
        Dias da semana
      </Select.Label>

      <Select.Control>
        <Select.Trigger 
          height={'48px'} 
          padding={'12px'} 
          borderRadius={'12px'} 
          color="#FFFFFF60" 
          fontSize={'18px'} 
          fontFamily={"Inter"} 
          border={hasError ? "2px solid #CF3F3F" : "2px solid #FFFFFF25"}
        >
          <Select.ValueText placeholder="Ex: Segunda, Quarta, Sexta" />
        </Select.Trigger>

        <Select.IndicatorGroup right={'12px'}>
          <img src="/images/svg/icon-arrow-down.svg" alt='' />
        </Select.IndicatorGroup>
      </Select.Control>

      <Portal>
        <Select.Positioner zIndex={'1500 !important'} width="320px">
          <Select.Content>
            {weekdays.items.map((day) => (
              <Select.Item item={day} key={day.value}>
                {day.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};

const weekdays = createListCollection({
  items: [
    { label: "Segunda", value: "Seg" },
    { label: "Terça", value: "Ter" },
    { label: "Quarta", value: "Qua" },
    { label: "Quinta", value: "Qui" },
    { label: "Sexta", value: "Sex" },
    { label: "Sábado", value: "Sáb" },
    { label: "Domingo", value: "Dom" },
  ],
});
