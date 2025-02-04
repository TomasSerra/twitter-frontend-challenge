export const LightTheme: Partial<Theme> = {
  background: "#fff",
  colors: {
    main: "#4A99E9",
    light: "#A5CCF4",
    dark: "#428AD2",
    error: "#E03C39",
    white: "#FFFFFF",
    inactiveBackground: "#F0F3F4",
    containerLine: "#F0F3F4",
    hover: "#E7E7E8",
    outline: "#000000",
    text: "#566370",
    black: "#000000",
    errorContainer: "#E5397F",
    successContainer: "#4CAF50",
    warningContainer: "#FFC107",
    infoContainer: "#2196F3",
  },
  hover: {
    default: "#428AD2",
    main: "#428AD2",
    white: "#FFFFFF",
    follow: "#428AD2",
    error: "#FF0000",
    outlined: "#f3f3f3",
    disabled: "#A5CCF4",
  },
  text: {
    default: "#566370",
    title: "#000000",
    error: "#E03C39",
  },
  font: {
    default: "Manrope",
    title: "Inter",
  },
};

export type Theme = {
  background: string;
  colors: {
    main: string;
    light: string;
    dark: string;
    error: string;
    white: string;
    inactiveBackground: string;
    containerLine: string;
    hover: string;
    outline: string;
    text: string;
    black: string;
    errorContainer: string;
    successContainer: string;
    warningContainer: string;
    infoContainer: string;
  };
  hover: {
    default: string;
    main: string;
    white: string;
    follow: string;
    error: string;
    outlined: string;
    disabled: string;
  };
  text: {
    default: string;
    title: string;
    error: string;
  };
  font: {
    default: string;
    title: string;
  };
};
