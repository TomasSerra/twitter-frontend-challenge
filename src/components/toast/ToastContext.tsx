import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import Toast, { ToastType } from "./Toast";

interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

interface ToastConfig {
  duration?: number;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

interface ToastContextType {
  showToast: (
    type: ToastType,
    message: string,
    position?: ToastMessage["position"]
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({
  children,
  config = {},
}: {
  children: ReactNode;
  config?: ToastConfig;
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const { duration = 3000, position: defaultPosition = "top-right" } = config;

  const showToast = useCallback(
    (type: ToastType, message: string, position?: ToastMessage["position"]) => {
      const id = Date.now();
      const toastPosition = position || defaultPosition;

      setToasts((prev) => [
        ...prev,
        { id, type, message, position: toastPosition },
      ]);

      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);

      return () => clearTimeout(timer);
    },
    [duration, defaultPosition]
  );

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          position={toast.position}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside a ToastProvider");
  }
  return context;
};
