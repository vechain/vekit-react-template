import {
  Modal,
  ModalOverlay,
  ModalBody,
  VStack,
  ModalCloseButton,
  ModalBodyProps,
  ModalContentProps,
  ModalProps,
  StackProps,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { BaseModalContent } from "./components/BaseModalContent";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  actionButtons?: ReactNode;
  motionPreset?: "slideInBottom" | "slideInRight" | "slideInTop" | "slideInLeft" | "none";
  modalProps?: Partial<ModalProps>;
  modalContentProps?: Partial<ModalContentProps>;
  modalBodyProps?: Partial<ModalBodyProps>;
  modalBodyContentProps?: Partial<StackProps>;
  modalActionButtonsProps?: Partial<StackProps>;
}

export const BaseModal = ({
  isOpen,
  onClose,
  children,
  actionButtons,
  motionPreset = "slideInBottom",
  modalProps = {},
  modalContentProps = {},
  modalBodyProps = {},
  modalBodyContentProps = {},
  modalActionButtonsProps = {},
}: BaseModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      motionPreset={motionPreset}
      trapFocus={false}
      {...modalProps}
    >
      <ModalOverlay backdropFilter="blur(15px)" bg="blackAlpha.400" />
      <BaseModalContent {...modalContentProps}>
        <ModalCloseButton zIndex={2} rounded="full" m={1} />
        <ModalBody
          px={{ base: 4, md: 8 }}
          pt={{ base: 16, md: 8 }}
          pb={{ base: "4.5rem", md: 8 }}
          display="flex"
          flexDirection="column"
          h="full"
          position="relative"
          overflow="hidden"
          gap={6}
          {...modalBodyProps}
        >
          {/* Content Section - Scrollable */}
          <VStack
            align="center"
            gap={4}
            flex="1"
            overflowY="auto"
            css={{
              "&::-webkit-scrollbar": {
                display: "none",
              },
              scrollbarWidth: "none",
            }}
            {...modalBodyContentProps}
          >
            {children}
          </VStack>

          {/* Action Buttons Section (Optional) */}
          <VStack
            align="stretch"
            gap={4}
            py={{ base: 4, md: 0 }}
            px={{ base: 4, md: 0 }}
            // Mobile: fixed to bottom. Desktop: static in flow
            position={{ base: "absolute", md: "static" }}
            bottom={{ base: 0, md: "auto" }}
            left={{ base: 0, md: "auto" }}
            right={{ base: 0, md: "auto" }}
            zIndex={1}
            {...modalActionButtonsProps}
            hidden={!actionButtons}
          >
            {actionButtons}
          </VStack>
        </ModalBody>
      </BaseModalContent>
    </Modal>
  );
};
