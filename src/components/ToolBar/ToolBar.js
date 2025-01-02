import {
  Button,
  DialogTitle,
  IconButton,
  Modal,
  ModalClose,
  ModalDialog,
  ModalOverflow,
  Stack,
} from "@mui/joy";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import CreateFarmerForm from "../CreateFarmerForm/CreateFarmerForm";
import CreateEscoForm from "../CreateEscoForm/CreateEscoForm";
import CreateGroupForm from "../CreateGroupForm/CreateGroupForm";
import CreateAgroProcessorForm from "../CreateAgroProcessorForm/CreateAgroProcessorForm";
import useModal from "../../hooks/useModal";

export default function ToolBar({ sx = [] }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFarmerModalOpen, openFarmerModal, closeFarmerModal] = useModal();
  const [isEscoModalOpen, openEscoModal, closeEscoModal] = useModal();
  const [isGroupModalOpen, openGroupModal, closeGroupModal] = useModal();
  const [
    isAgroProcessorModalOpen,
    openAgroProcessorModal,
    closeAgroProcessorModal,
  ] = useModal();
  return (
    <>
      <Stack sx={[...(Array.isArray(sx) ? sx : [sx])]} direction="row">
        <Stack
          direction="row"
          sx={{
            transform: isCollapsed ? "scale(1)" : "scale(0)",
            transition: "transform 0.5s",
            overflowY: "scroll",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "&": {
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            },
            alignItems: "center",
          }}
        >
          <Button
            size="sm"
            color="success"
            sx={{
              marginRight: 1,
              borderRadius: 60,
              flex: "1 0 auto",
              opacity: 1,
            }}
            onClick={openEscoModal}
          >
            Create Esco
          </Button>
          <Button
            size="sm"
            color="success"
            sx={{ marginRight: 1, borderRadius: 60, flex: "1 0 auto" }}
            onClick={openFarmerModal}
          >
            Create Farmer
          </Button>
          <Button
            size="sm"
            color="success"
            sx={{ marginRight: 1, borderRadius: 60, flex: "1 0 auto" }}
            onClick={openGroupModal}
          >
            Create Group
          </Button>
          <Button
            size="sm"
            color="success"
            sx={{ marginRight: 1, borderRadius: 60, flex: "1 0 auto" }}
            onClick={openAgroProcessorModal}
          >
            Create Agro Processor
          </Button>
        </Stack>
        <IconButton
          size="lg"
          variant="solid"
          color="success"
          sx={{ borderRadius: "50%" }}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <AddIcon
            size="lg"
            sx={{
              transition: "transform, 0.3s",
              transform: isCollapsed ? "rotate(45deg)" : "rotate(0deg)",
            }}
          />
        </IconButton>
      </Stack>
      <CreateFarmerModal
        isOpen={isFarmerModalOpen}
        onClose={closeFarmerModal}
      />
      <CreateEscoModal isOpen={isEscoModalOpen} onClose={closeEscoModal} />
      <CreateGroupModal isOpen={isGroupModalOpen} onClose={closeGroupModal} />
      <CreateAgroProcessorModal
        isOpen={isAgroProcessorModalOpen}
        onClose={closeAgroProcessorModal}
      />
    </>
  );
}

function CreateFarmerModal({ isOpen, onClose }) {
  return (
    <Modal open={isOpen} onClose={onClose} size="lg">
      <ModalOverflow>
        <ModalDialog sx={{ width: 500, maxWidth: "95vw" }}>
          <ModalClose />
          <DialogTitle>Create Farmer</DialogTitle>
          <CreateFarmerForm />
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  );
}

function CreateEscoModal({ isOpen, onClose }) {
  return (
    <Modal open={isOpen} onClose={onClose} size="lg">
      <ModalOverflow>
        <ModalDialog sx={{ width: 500, maxWidth: "95vw" }}>
          <ModalClose />
          <DialogTitle>Create Esco</DialogTitle>
          <CreateEscoForm />
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  );
}

function CreateGroupModal({ isOpen, onClose }) {
  return (
    <Modal open={isOpen} onClose={onClose} size="lg">
      <ModalOverflow>
        <ModalDialog sx={{ width: 500, maxWidth: "95vw" }}>
          <ModalClose />
          <DialogTitle>Create Group</DialogTitle>
          <CreateGroupForm />
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  );
}

function CreateAgroProcessorModal({ isOpen, onClose }) {
  return (
    <Modal open={isOpen} onClose={onClose} size="lg">
      <ModalOverflow>
        <ModalDialog sx={{ width: 500, maxWidth: "95vw" }}>
          <ModalClose />
          <DialogTitle>Create Agro Processor</DialogTitle>
          <CreateAgroProcessorForm />
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  );
}
