import styled from "styled-components";
import { ToastType } from "./Toast";
import { Theme } from "../../util/LightTheme";

interface ToastContainerProps {
  type: ToastType;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

const getContainerColor = (props: ToastContainerProps & { theme: Theme }) => {
  switch (props.type) {
    case ToastType.ALERT:
      return props.theme.colors.errorContainer;
    case ToastType.SUCCESS:
      return props.theme.colors.successContainer;
    case ToastType.WARNING:
      return props.theme.colors.warningContainer;
    case ToastType.INFO:
      return props.theme.colors.infoContainer;
    default:
      return props.theme.colors.errorContainer;
  }
};

export const StyledToastContainer = styled.div<ToastContainerProps>`
  display: flex;
  padding: 8px 16px;
  align-items: center;
  gap: 16px;
  position: fixed;
  border-radius: 8px;
  border: 1px solid ${(props) => getContainerColor(props)};
  background: ${(props) => props.theme.background};

  p {
    color: ${(props) => getContainerColor(props)};
    margin: 0;
    font-variant-numeric: lining-nums tabular-nums;
    font-family: ${(props) => props.theme.font.default};
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 110%;
    letter-spacing: -0.12px;
  }
  transition: 0.3s ease-in-out;
  &:hover {
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  }
  ${({ position }) => {
    switch (position) {
      case "top-right":
        return `top: 20px; right: 20px;`;
      case "top-left":
        return `top: 20px; left: 20px;`;
      case "bottom-right":
        return `bottom: 20px; right: 20px;`;
      case "bottom-left":
        return `bottom: 20px; left: 20px;`;
      default:
        return `bottom: 20px; right: 20px;`;
    }
  }}
`;
