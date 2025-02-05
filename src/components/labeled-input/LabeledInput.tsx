import { ChangeEvent, HTMLInputTypeAttribute, useRef, useState } from "react";
import { StyledInputContainer, InputType, InputSize } from "./InputContainer";
import { StyledInputTitle } from "./InputTitle";
import { StyledInputElement } from "./StyledInputElement";

interface InputWithLabelProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: HTMLInputTypeAttribute;
  label: string;
  placeholder: string;
  required?: boolean;
  error?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  name: string;
  hasError?: boolean;
  inputSize?: InputSize;
  inputType?: InputType;
}

const LabeledInput = ({
  label,
  placeholder,
  required = false,
  error,
  onChange,
  type = "text",
  value,
  name,
  hasError = false,
  inputSize = InputSize.MEDIUM,
  inputType = InputType.OUTLINED,
  ...props
}: InputWithLabelProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [focus, setFocus] = useState(false);

  const handleFocus = () => setFocus(true);
  const handleBlur = () => setFocus(false);
  const handleClick = () => inputRef.current?.focus();

  return (
    <>
      <StyledInputContainer
        className={`${hasError ? "error" : ""} ${focus ? "active-div" : ""}`}
        onClick={handleClick}
        inputType={inputType}
        inputSize={inputSize}
      >
        <StyledInputTitle
          className={`${focus ? "active-label" : ""} ${
            hasError ? "error" : ""
          }`}
        >
          {label}
        </StyledInputTitle>
        <StyledInputElement
          type={type}
          required={required}
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={onChange}
          className={hasError ? "error" : ""}
          ref={inputRef}
          value={value}
          name={name}
          {...props}
        />
      </StyledInputContainer>
      <p className="error-message">{error}</p>
    </>
  );
};

export default LabeledInput;
