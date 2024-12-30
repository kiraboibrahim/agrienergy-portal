import {
  Modal,
  ModalClose,
  ModalDialog,
  DialogTitle,
  ModalOverflow,
} from "@mui/joy";
import { createContext, useContext } from "react";
import useModal from "../../hooks/useModal";
import CreateLearningMaterialForm from "../CreateLearningMaterialForm/CreateLearningMaterialForm";

const LearningMaterialModalContext = createContext();

export default function CreateLearningMaterialModal({ product }) {
  const [isOpen, , closeModal] = useContext(LearningMaterialModalContext);
  return (
    <Modal open={isOpen} onClose={closeModal} size="lg">
      <ModalOverflow>
        <ModalDialog sx={{ width: 500, maxWidth: "95vw" }}>
          <ModalClose />
          <DialogTitle>Upload Learning Material</DialogTitle>
          <CreateLearningMaterialForm product={product} />
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  );
}

export function useLearningModalContext() {
  return useContext(LearningMaterialModalContext);
}

export function LearningModalContextProvider({ children }) {
  const [isOpen, openModal, closeModal] = useModal();
  return (
    <LearningMaterialModalContext.Provider
      value={[isOpen, openModal, closeModal]}
    >
      {children}
    </LearningMaterialModalContext.Provider>
  );
}
