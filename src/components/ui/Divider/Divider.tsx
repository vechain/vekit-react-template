import { Box, BoxProps } from "@chakra-ui/react";

interface DividerProps extends BoxProps {}

export const Divider = ({ my = 4, ...props }: DividerProps) => {
  return <Box height="1px" width="100%" my={my} bg="rgba(255, 255, 255, 0.2)" {...props} />;
};
