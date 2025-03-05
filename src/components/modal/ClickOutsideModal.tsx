import React, { useEffect, useRef } from "react";

interface ClickOutsideModalProps {
  children: React.ReactNode;
  show: boolean;
  onClose: () => void;
  active?: boolean;
}

const ClickOutsideModal = ({
  children,
  show,
  onClose,
  active = true,
}: ClickOutsideModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    event.stopPropagation();
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (show && active) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, active]);

  return <>{show && <div ref={modalRef}>{children}</div>}</>;
};

export default ClickOutsideModal;
