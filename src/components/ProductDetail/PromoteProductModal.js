import {
  Modal,
  ModalClose,
  ModalDialog,
  DialogTitle,
  ModalOverflow,
} from "@mui/joy";
import PromoteProductForm from "../PromoteProductForm/PromoteProductForm";
import { createContext, useContext } from "react";
import useModal from "../../hooks/useModal";

const PromoteProductModalContext = createContext();

export function PromoteProductModalContextProvider({ children }) {
  const [isOpen, openModal, closeModal] = useModal();
  return (
    <PromoteProductModalContext.Provider
      value={[isOpen, openModal, closeModal]}
    >
      {children}
    </PromoteProductModalContext.Provider>
  );
}

export function usePromoteProductModalContext() {
  return useContext(PromoteProductModalContext);
}

export default function PromoteProductModal({ product }) {
  const [isOpen, , closeModal] = usePromoteProductModalContext();
  return (
    <Modal open={isOpen} onClose={closeModal} size="lg">
      <ModalOverflow>
        <ModalDialog sx={{ width: 500, maxWidth: "95vw" }}>
          <ModalClose />
          <DialogTitle>Promote Prouct</DialogTitle>
          <PromoteProductForm product={product} />
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  );
}
