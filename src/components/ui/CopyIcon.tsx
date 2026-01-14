import { Flex, Icon, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { Copy } from "react-feather";

interface CopyIconProps {
  content: string;
  baseTooltipText?: string;
  copiedTooltipText?: string;
  size?: number | string;
  color?: string;
  hidden?: boolean;
}

export const CopyIcon = ({
  content,
  size = "inherit",
  color = "whiteAlpha.600",
  baseTooltipText = "Copy address",
  copiedTooltipText = "Address copied!",
  hidden = false,
}: CopyIconProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(content ?? "");
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };
  if (hidden) return null;
  return (
    <Tooltip
      as="span"
      label={isCopied ? copiedTooltipText : baseTooltipText}
      isOpen={isCopied ? true : undefined}
      placement="bottom"
      openDelay={40}
      closeDelay={40}
      bg="tooltip.background"
      color="tooltip.text"
      hasArrow
      arrowShadowColor="tooltip.background"
      borderRadius="8px"
      fontSize="sm"
      p={2}
      fontWeight="medium"
    >
      <Flex alignItems="center">
        <Icon as={Copy} onClick={handleCopyAddress} cursor="pointer" size={size} color={color} />
      </Flex>
    </Tooltip>
  );
};
