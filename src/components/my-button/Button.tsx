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
}

const Button = ({
  children,
  size,
  buttonType = ButtonType.FULFILLED,
  buttonColor = ButtonColor.PRIMARY,
  ...props
}: ButtonProps) => {
  return (
    <StyledButton
      size={size}
      buttonType={buttonType}
      buttonColor={buttonColor}
      {...props}
    >
      <span>{children}</span>
    </StyledButton>
  );
};

export default Button;
