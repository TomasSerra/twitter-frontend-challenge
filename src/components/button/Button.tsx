import React, { MouseEventHandler } from "react";
import { ButtonType, StyledButton } from "./StyledButton";

interface ButtonProps {
  text: string;
  size: string;
  buttonType: ButtonType;
  onClick?: MouseEventHandler;
  disabled?: boolean;
  type?: string;
}
const Button = ({
  text,
  size,
  buttonType,
  onClick,
  disabled,
  type,
}: ButtonProps) => {
  return (
    <StyledButton
      size={size}
      buttonType={disabled ? ButtonType.DISABLED : buttonType}
      disabled={buttonType === "DISABLED" || (disabled ? disabled : false)}
      onClick={onClick}
    >
      {text}
    </StyledButton>
  );
};

export default Button;
