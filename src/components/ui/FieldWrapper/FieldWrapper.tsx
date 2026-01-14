import { Flex, Text, VStack } from "@chakra-ui/react";
import { BaseTooltip } from "../BaseTooltip";
import { HelpCircle } from "react-feather";

interface FieldWrapperProps {
  label: string;
  children: React.ReactNode;
  tooltip?: string;
}

export const FieldWrapper = ({ label, tooltip, children }: FieldWrapperProps) => {
  return (
    <VStack width="full" alignItems="start" gap={1}>
      <Flex gap={1} width="full" alignItems="center">
        <Text color="rgba(186, 196, 220, 1)">{label}</Text>
        {tooltip && (
          <BaseTooltip text={tooltip} placement="top">
            <HelpCircle color="rgba(186, 196, 220, 1)" size={14} />
          </BaseTooltip>
        )}
      </Flex>
      {children}
    </VStack>
  );
};
