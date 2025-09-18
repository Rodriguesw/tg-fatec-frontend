import { useState } from 'react';

import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

import * as S from './styles';


interface RatingStarsProps {
  value?: number;
  onChange?: (value: number) => void;
  size?: number;
  interactive?: boolean;
}

export function RatingStars({ value = 0, onChange, size = 24, interactive = false }: RatingStarsProps) {
  
  return (
    <S.Container>
      <Rating 
        readOnly={!interactive} 
        value={value} 
        key={value}
        style={{ maxWidth: size * 5 }}
        onChange={onChange}
      />
    </S.Container>
  );
}