import { VStack, StackProps } from "@chakra-ui/react";
import { ReactNode } from "react";

interface BottomActionsProps extends Omit<StackProps, "children"> {
  children: ReactNode;
  props?: StackProps;
}

export const BottomActions = ({ children, ...props }: BottomActionsProps) => {
  return (
    <VStack
      position={{ base: "fixed", md: "relative" }}
      bottom="0"
      left="0"
      right="0"
      zIndex="999"
      p={{ base: 6, md: 0 }}
      mt={{ base: 0, md: 6 }}
      spacing={4}
      bg={{ base: "#0B0C10", md: "transparent" }}
      borderTop={{ base: "1px solid #FFFFFF33", md: "none" }}
      width="full"
      maxWidth={{ base: "100%", md: "400px" }}
      alignSelf="center"
      {...props}
    >
      {children}
    </VStack>
  );
};
