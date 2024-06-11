import styled, { css } from "styled-components";

interface ButtonContainerProps {
  variant: "primary" | "secondary" | "danger" | "sucess";
}

const buttonVariants = {
  primary: "purple",
  secondary: "orange",
  danger: "red",
  sucess: "green",
};

export const ButtonContainer = styled.button<ButtonContainerProps>`
  width: 100px;
  height: 40px;
  margin: 4px;
  border-radius: 4px;

  background-color: ${(props) => props.theme["green-500"]};
  color: ${(props) => props.theme["gray-100"]};

  /* ${(props) => {
    return css`
      background-color: ${buttonVariants[props.variant]};
    `;
  }} */
`;
