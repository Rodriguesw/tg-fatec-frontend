import { theme } from "./theme";
import styled from "styled-components";

export const H1 = styled.h1`
    text-align: center;

    font-size: 2.5rem;
    font-weight: 400;
    line-height: 100%;
    font-family: "Anton";
    color: ${({color}) => (color ? color : theme.colors.branco.principal)};
`;

export const H2 = styled.h2`
    text-align: center;

    font-size: 2rem;
    font-weight: 400;
    line-height: 100%;
    font-family: "Anton";
    color: ${({color}) => (color ? color : theme.colors.branco.principal)};
`;

export const H3 = styled.h3`
    text-align: center;

    font-size: 1.75rem;
    font-weight: 400;
    line-height: 100%;
    font-family: "Anton";
    color: ${({color}) => (color ? color : theme.colors.branco.principal)};
`;

export const LG = styled.p`
    text-align: center;

    font-size: 1.375rem;
    font-weight: 400;
    line-height: 100%;
    font-family: "Anton";
    color: ${({color}) => (color ? color : theme.colors.branco.principal)};
`;

export const MD = styled.p`
    text-align: center;

    font-size: 1.125rem;
    font-weight: 400;
    line-height: 100%;
    font-family: "Anton";
    color: ${({color}) => (color ? color : theme.colors.branco.principal)};
`;

export const SM = styled.p`
    text-align: center;

    font-size: 1rem;
    font-weight: 400;
    line-height: 100%;
    font-family: "Anton";
    color: ${({color}) => (color ? color : theme.colors.branco.principal)};
`;



