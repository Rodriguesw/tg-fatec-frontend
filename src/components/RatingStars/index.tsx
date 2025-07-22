import { useState } from 'react';

import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

import * as S from './styles';


interface RatingStarsProps {
  value: number;
}

export function RatingStars({ value }: RatingStarsProps) {
  
  return (
    <S.Container>
      <Rating 
        readOnly 
        value={value} 
        key={value} 
      />
    </S.Container>
  );
}