import React, {
  ChangeEvent,
  HTMLInputTypeAttribute,
  useRef,
  useState,
} from "react";
import { StyledInputContainer } from "./InputContainer";
import { StyledInputTitle } from "./InputTitle";
import { StyledInputElement } from "./StyledInputElement";

interface InputWithLabelProps {
  type?: HTMLInputTypeAttribute;
  title: string;
  placeholder: string;
  required: boolean;
  error?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  name: string;
  hasError?: boolean;
}

const LabeledInput = ({
  title,
  placeholder,
  required,
  error,
  onChange,
  type = "text",
  value,
  name,
  hasError = false,
}: InputWithLabelProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [focus, setFocus] = useState(false);

  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = () => {
    setFocus(false);
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      <StyledInputContainer
        className={`${hasError ? "error" : ""}`}
        onClick={handleClick}
      >
        <StyledInputTitle
          className={`${focus ? "active-label" : ""} ${
            hasError ? "error" : ""
          }`}
        >
          {title}
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
        />
      </StyledInputContainer>
      <p className="error-message">{error}</p>
    </>
  );
};

export default LabeledInput;
