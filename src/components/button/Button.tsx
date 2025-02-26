import React from "react";
import {
  ButtonType,
  ButtonSize,
  StyledButton,
  ButtonColor,
} from "./StyledButton";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size: ButtonSize;
  buttonType?: ButtonType;
  buttonColor?: ButtonColor;
  disabled?: boolean;
}

const Button = ({
  children,
  size,
  buttonType = ButtonType.FULFILLED,
  buttonColor = ButtonColor.PRIMARY,
  disabled = false,
  ...props
}: ButtonProps) => {
  return (
    <StyledButton
      size={size}
      buttonType={buttonType}
      buttonColor={buttonColor}
      disabled={disabled}
      {...props}
    >
      <span>{children}</span>
    </StyledButton>
  );
};

export default Button;
