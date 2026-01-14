import { Box, Circle, Flex } from "@chakra-ui/react";

interface BackButtonHeaderProps {
  children?: React.ReactNode;
  onClickBack: () => void;
  disabled?: boolean;
}

export const BackButtonHeader = ({
  children,
  onClickBack,
  disabled = false,
}: BackButtonHeaderProps) => {
  return (
    <Box id="back-button-header" bg="transparent" mb={6} w="full">
      <Flex
        id="back-button-header-content"
        gap={3}
        align="center"
        justify="left"
        w="fit-content"
        onClick={() => (!disabled ? onClickBack() : null)}
        cursor={!disabled ? "pointer" : "auto"}
      >
        <Circle size="32px" bg="#FFFFFF1A" hidden={disabled}>
          ←
        </Circle>
        {children}
      </Flex>
    </Box>
  );
};
