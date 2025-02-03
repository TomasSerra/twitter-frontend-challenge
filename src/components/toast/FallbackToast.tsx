import Toast, { ToastType } from "./Toast";

const FallbackToast = ({
  error,
  position,
}: {
  error: Error;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) => {
  return (
    <Toast type={ToastType.ALERT} message={error.message} position={position} />
  );
};

export default FallbackToast;
