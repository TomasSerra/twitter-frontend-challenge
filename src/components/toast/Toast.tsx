import { useEffect, useState } from "react";
import { StyledToastContainer } from "./ToastContainer";
import { AlertIcon } from "../icon/Icon";
import { LightTheme } from "../../util/LightTheme";

export enum ToastType {
  ALERT = "ALERT",
  SUCCESS = "SUCCESS",
  WARNING = "WARNING",
  INFO = "INFO",
}

interface ToastProps {
  message: string;
  type: ToastType;
  show?: boolean;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  onClose?: () => void;
}

const Toast = ({
  message,
  type,
  show = true,
  position,
  onClose,
}: ToastProps) => {
  const [isShown, setIsShown] = useState<boolean>(show);

  useEffect(() => {
    if (!show) {
      setIsShown(false);
    }
  }, [show]);

  const handleClose = () => {
    setIsShown(false);
    if (onClose) onClose();
  };

  const iconMap = {
    [ToastType.ALERT]: <AlertIcon />,
    [ToastType.SUCCESS]: null,
    [ToastType.WARNING]: null,
    [ToastType.INFO]: null,
  };

  return isShown ? (
    <StyledToastContainer
      type={type}
      onClick={handleClose}
      position={position}
      theme={LightTheme}
    >
      {iconMap[type] || null}
      <p>{message}</p>
    </StyledToastContainer>
  ) : null;
};

export default Toast;
