import { createContext, useContext, useMemo, useState } from "react";
import GlobalModal from "../components/GlobalModal";

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null);

  const showModal = (payload, fallback = {}) => {
    if (typeof payload === "string") {
      setModal({
        type: fallback.type || "info",
        title: fallback.title || "Notice",
        message: payload,
        confirmText: fallback.confirmText,
        onConfirm: fallback.onConfirm,
        autoClose: fallback.autoClose || false,
        autoCloseDelay: fallback.autoCloseDelay || 1800,
      });
      return;
    }

    setModal(payload || null);
  };

  const hideModal = () => setModal(null);

  const value = useMemo(() => ({ showModal, hideModal }), []);

  return (
    <ModalContext.Provider value={value}>
      {children}
      <GlobalModal modal={modal} onClose={hideModal} />
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
