import {theme } from "./theme";
import styled from "styled-components";

interface TypographyProps {
    color?: string;
    family?: string;
    weight?: number;
}

export const H1 = styled.h1<TypographyProps>`
    text-align: center;

    font-size: 2.5rem;
    line-height: 60px;
    font-weight: ${({weight}) => (weight ? weight : 400)};
    font-family: ${({family}) => (family ? family : theme.fonts.anton)};
    color: ${({color}) => (color ? color : theme.colors.branco.principal)};
`;

export const H2 = styled.h2<TypographyProps>`
    text-align: center;

    font-size: 2rem;
    line-height: 48px;
    font-weight: ${({weight}) => (weight ? weight : 400)};
    font-family: ${({family}) => (family ? family : theme.fonts.anton)};
    color: ${({color}) => (color ? color : theme.colors.branco.principal)};
`;

export const H3 = styled.h3<TypographyProps>`
    text-align: center;

    font-size: 1.75rem;
    line-height: 42px;
    font-weight: ${({weight}) => (weight ? weight : 400)};
    font-family: ${({family}) => (family ? family : theme.fonts.anton)};
    color: ${({color}) => (color ? color : theme.colors.branco.principal)};
`;

export const LG = styled.p<TypographyProps>`
    text-align: center;

    font-size: 1.375rem;
    line-height: 27px;
    font-weight: ${({weight}) => (weight ? weight : 400)};
    font-family: ${({family}) => (family ? family : theme.fonts.anton)};
    color: ${({color}) => (color ? color : theme.colors.branco.principal)};
`;

export const MD = styled.p<TypographyProps>`
    text-align: center;

    font-size: 1.125rem;
    line-height: 22px;
    font-weight: ${({weight}) => (weight ? weight : 400)};
    font-family: ${({family}) => (family ? family : theme.fonts.anton)};
    color: ${({color}) => (color ? color : theme.colors.branco.principal)};
`;

export const SM = styled.p<TypographyProps>`
    text-align: center;

    font-size: 1rem;
    line-height: 19px;
    font-weight: ${({weight}) => (weight ? weight : 400)};
    font-family: ${({family}) => (family ? family : theme.fonts.anton)};
    color: ${({color}) => (color ? color : theme.colors.branco.principal)};
`;



