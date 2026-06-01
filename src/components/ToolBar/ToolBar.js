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
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import AgricultureOutlinedIcon from "@mui/icons-material/AgricultureOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
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
      <Stack
        sx={[
          {
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        direction="row"
      >
        {/* Glassmorphic Actions Capsule */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            opacity: isCollapsed ? 1 : 0,
            transform: isCollapsed ? "translateX(0) scale(1)" : "translateX(20px) scale(0.9)",
            pointerEvents: isCollapsed ? "auto" : "none",
            transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            bgcolor: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(20px)",
            py: 1,
            px: 2,
            borderRadius: "xl",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            alignItems: "center",
            overflowX: "auto",
            maxWidth: "calc(100vw - 120px)",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <Button
            size="sm"
            variant="soft"
            color="primary"
            startDecorator={<BusinessCenterOutlinedIcon sx={{ fontSize: "1rem" }} />}
            sx={{
              borderRadius: "xl",
              fontWeight: "600",
              px: 1.5,
              whiteSpace: "nowrap",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-1px)" },
            }}
            onClick={openEscoModal}
          >
            Create ESCO
          </Button>
          <Button
            size="sm"
            variant="soft"
            color="success"
            startDecorator={<AgricultureOutlinedIcon sx={{ fontSize: "1rem" }} />}
            sx={{
              borderRadius: "xl",
              fontWeight: "600",
              px: 1.5,
              whiteSpace: "nowrap",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-1px)" },
            }}
            onClick={openFarmerModal}
          >
            Create Farmer
          </Button>
          <Button
            size="sm"
            variant="soft"
            color="neutral"
            startDecorator={<GroupsOutlinedIcon sx={{ fontSize: "1rem" }} />}
            sx={{
              borderRadius: "xl",
              fontWeight: "600",
              px: 1.5,
              whiteSpace: "nowrap",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-1px)" },
            }}
            onClick={openGroupModal}
          >
            Create Group
          </Button>
          <Button
            size="sm"
            variant="soft"
            color="warning"
            startDecorator={<StorefrontOutlinedIcon sx={{ fontSize: "1rem" }} />}
            sx={{
              borderRadius: "xl",
              fontWeight: "600",
              px: 1.5,
              whiteSpace: "nowrap",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-1px)" },
            }}
            onClick={openAgroProcessorModal}
          >
            Create Agro Processor
          </Button>
        </Stack>

        {/* Floating Action Button (FAB) */}
        <IconButton
          size="lg"
          variant="solid"
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)",
            boxShadow: "0 10px 25px rgba(27, 94, 32, 0.3)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              background: "linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)",
              transform: "translateY(-3px) scale(1.05)",
              boxShadow: "0 12px 28px rgba(27, 94, 32, 0.4)",
            },
            "&:active": {
              transform: "translateY(0) scale(0.95)",
            },
          }}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <AddIcon
            sx={{
              fontSize: "1.8rem",
              color: "white",
              transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
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
        <ModalDialog sx={{ width: 500, maxWidth: "95vw", borderRadius: "xl" }}>
          <ModalClose />
          <DialogTitle sx={{ fontWeight: "bold" }}>Create Farmer</DialogTitle>
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
        <ModalDialog sx={{ width: 500, maxWidth: "95vw", borderRadius: "xl" }}>
          <ModalClose />
          <DialogTitle sx={{ fontWeight: "bold" }}>Create Esco</DialogTitle>
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
        <ModalDialog sx={{ width: 500, maxWidth: "95vw", borderRadius: "xl" }}>
          <ModalClose />
          <DialogTitle sx={{ fontWeight: "bold" }}>Create Group</DialogTitle>
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
        <ModalDialog sx={{ width: 500, maxWidth: "95vw", borderRadius: "xl" }}>
          <ModalClose />
          <DialogTitle sx={{ fontWeight: "bold" }}>Create Agro Processor</DialogTitle>
          <CreateAgroProcessorForm />
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  );
}
