import styled from "styled-components";
import "@fontsource/manrope";

interface ButtonProps {
  size: ButtonSize;
  buttonType: ButtonType;
  buttonColor: ButtonColor;
}

export enum ButtonColor {
  PRIMARY = "PRIMARY",
  WHITE = "WHITE",
  DELETE = "DELETE",
}

export enum ButtonType {
  OUTLINED = "OUTLINED",
  FULFILLED = "FULFILLED",
  GHOST = "GHOST",
}

export enum ButtonSize {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

const getButtonStyles = (props: ButtonProps & { theme: any }) => {
  const { buttonType, buttonColor, theme } = props;

  const bgColorMap = {
    PRIMARY: {
      FULFILLED: theme.colors.main,
      OUTLINED: theme.colors.white,
      GHOST: "transparent",
    },
    WHITE: {
      FULFILLED: theme.colors.white,
      OUTLINED: theme.colors.white,
      GHOST: "transparent",
    },
    DELETE: {
      FULFILLED: theme.colors.error,
      OUTLINED: theme.colors.white,
      GHOST: "transparent",
    },
  };

  const borderMap = {
    PRIMARY: {
      OUTLINED: `1px solid ${theme.colors.main}`,
      FULFILLED: "none",
      GHOST: "none",
    },
    WHITE: {
      OUTLINED: `1px solid ${theme.colors.outline}`,
      FULFILLED: "none",
      GHOST: "none",
    },
    DELETE: {
      OUTLINED: `1px solid ${theme.colors.error}`,
      FULFILLED: "none",
      GHOST: "none",
    },
  };

  const textColorMap = {
    PRIMARY: {
      OUTLINED: theme.colors.main,
      GHOST: theme.colors.main,
      FULFILLED: theme.colors.white,
    },
    WHITE: {
      OUTLINED: theme.colors.black,
      GHOST: theme.colors.black,
      FULFILLED: theme.colors.black,
    },
    DELETE: {
      OUTLINED: theme.colors.error,
      GHOST: theme.colors.error,
      FULFILLED: theme.colors.white,
    },
  };

  const hoverBgColorMap = {
    PRIMARY: {
      FULFILLED: theme.hover.main,
      OUTLINED: "transparent",
      GHOST: theme.hover.transparent,
    },
    WHITE: {
      FULFILLED: theme.hover.white,
      OUTLINED: "transparent",
      GHOST: theme.hover.transparent,
    },
    DELETE: {
      FULFILLED: theme.hover.error,
      OUTLINED: "transparent",
      GHOST: theme.hover.transparent,
    },
  };

  const hoverBorderMap = {
    PRIMARY: {
      OUTLINED: `1px solid ${theme.hover.main}`,
      FULFILLED: "none",
      GHOST: "none",
    },
    WHITE: {
      OUTLINED: `1px solid ${theme.hover.outline}`,
      FULFILLED: "none",
      GHOST: "none",
    },
    DELETE: {
      OUTLINED: `1px solid ${theme.hover.error}`,
      FULFILLED: "none",
      GHOST: "none",
    },
  };

  return {
    background: bgColorMap[buttonColor][buttonType],
    border: borderMap[buttonColor][buttonType],
    color: textColorMap[buttonColor][buttonType],
    hover: {
      background: hoverBgColorMap[buttonColor][buttonType],
      border: hoverBorderMap[buttonColor][buttonType],
    },
  };
};

export const StyledButton = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  gap: 8px;
  margin-bottom: 8px;
  width: ${(props) => {
    switch (props.size) {
      case ButtonSize.SMALL:
        return "75px";
      case ButtonSize.MEDIUM:
        return "100px";
      case ButtonSize.LARGE:
        return "180px";
      default:
        return "100px";
    }
  }};
  height: 33px;
  border-radius: 40px;
  font-family: ${(props) => props.theme.font.default};
  font-style: normal;
  font-weight: 800;
  font-size: 15px;
  line-height: 110%;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;

  &:active {
    transform: scale(0.95);
  }

  ${({ theme, ...props }) => {
    const styles = getButtonStyles({ theme, ...props });
    return `
      background-color: ${styles.background};
      border: ${styles.border};
      color: ${styles.color};
    `;
  }}

  &:hover {
    ${({ theme, ...props }) => {
      const styles = getButtonStyles({ theme, ...props });
      return `
        background-color: ${styles.hover.background};
        border: ${styles.hover.border};
      `;
    }}
  }

  span {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
`;
