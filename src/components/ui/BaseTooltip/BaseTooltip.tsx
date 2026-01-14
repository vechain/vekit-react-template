import { Flex, Text, Tooltip, useDisclosure } from "@chakra-ui/react";
import { Fragment } from "react";
import { BaseModal } from "../BaseModal/BaseModal";
import { useBreakpointValue } from "@/hooks";

type Props = {
  children: React.ReactNode;
  text: string | React.ReactNode;
  placement?: "top" | "bottom";
  showTooltip?: boolean;
  showOnMobile?: boolean;
};

export const BaseTooltip: React.FC<Props> = ({
  children,
  text,
  placement = "bottom",
  showTooltip = true,
  showOnMobile = true,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleOpenMessage = () => {
    if (isMobile && showOnMobile) {
      onOpen();
    }
  };

  if (!showTooltip) {
    return <>{children}</>;
  }

  return (
    <Fragment>
      <Tooltip
        data-cy="base-tooltip"
        label={text}
        placement={placement}
        openDelay={40}
        closeDelay={40}
        bg="tooltip.background"
        color="tooltip.text"
        borderRadius="lg"
        border="1px solid"
        borderColor="tooltip.border"
        fontSize="sm"
        p={4}
        fontWeight="medium"
        maxWidth="300px"
        lineHeight={1.5}
      >
        <Flex onClick={handleOpenMessage} alignItems="center">
          {children}
        </Flex>
      </Tooltip>
      <BaseModal isOpen={isOpen} onClose={onClose}>
        <Text px={6}>{text}</Text>
      </BaseModal>
    </Fragment>
  );
};
