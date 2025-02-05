import styled from "styled-components";

export enum InputType {
  OUTLINED = "OUTLINED",
  FULFILLED = "FULFILLED",
}

export enum InputSize {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

interface InputProps {
  inputSize: InputSize;
  inputType: InputType;
}

const getInputStyles = (props: InputProps & { theme: any }) => {
  const { inputType, theme } = props;

  const bgColorMap = {
    FULFILLED: theme.colors.softWhite,
    OUTLINED: "transparent",
  };

  const borderMap = {
    OUTLINED: `1px solid ${theme.colors.outline}`,
    FULFILLED: "none",
  };

  const textColorMap = {
    OUTLINED: theme.colors.black,
    FULFILLED: theme.colors.black,
  };

  const activeBgColorMap = {
    FULFILLED: theme.colors.softPrimary,
    OUTLINED: "transparent",
  };

  const activeBorderMap = {
    OUTLINED: `1px solid ${theme.colors.main}`,
    FULFILLED: "none",
  };

  return {
    background: bgColorMap[inputType],
    border: borderMap[inputType],
    color: textColorMap[inputType],
    active: {
      background: activeBgColorMap[inputType],
      border: activeBorderMap[inputType],
    },
    error: {
      border: `1px solid ${theme.colors.error}`,
    },
  };
};

export const StyledInputContainer = styled.div<InputProps>`
  border-radius: 8px;
  padding: 8px;
  transition: 0.3s;
  ${({ theme, ...props }) => {
    const styles = getInputStyles({ theme, ...props });
    return `
      background-color: ${styles.background};
      border: ${styles.border};
      color: ${styles.color};
    `;
  }}

  width: ${(props) => {
    switch (props.inputSize) {
      case InputSize.SMALL:
        return "200px";
      case InputSize.MEDIUM:
        return "337px";
      case InputSize.LARGE:
        return "500px";
      default:
        return "337px";
    }
  }};

  &.active-div {
    ${({ theme, ...props }) => {
      const styles = getInputStyles({ theme, ...props });
      return `
        background-color: ${styles.active.background};
        border: ${styles.active.border};
      `;
    }}
  }

  &.error {
    ${({ theme, ...props }) => {
      const styles = getInputStyles({ theme, ...props });
      return `
        border: ${styles.error.border};
      `;
    }}
  }

  @media (min-width: 600px) {
    width: ${(props) => {
      switch (props.inputSize) {
        case InputSize.SMALL:
          return "200px";
        case InputSize.MEDIUM:
          return "337px";
        case InputSize.LARGE:
          return "500px";
        default:
          return "337px";
      }
    }};
  }
`;
