import { ModalContent, ModalContentProps } from "@chakra-ui/react";

export const BaseModalContent = ({ children, ...others }: ModalContentProps) => {
  return (
    <ModalContent
      bg="rgba(21, 21, 21, 0.4)"
      backdropFilter={"blur(20px)"}
      border={{ base: "none", md: "1px solid rgba(255, 255, 255, 0.20)" }}
      borderTop={"1px solid rgba(255, 255, 255, 0.20)"}
      boxShadow="none"
      // Mobile: fixed to bottom for native app feel. Desktop: centered
      position={{ base: "fixed", md: "relative" }}
      bottom={{ base: 0, md: "auto" }}
      mb={{ base: 0, md: "auto" }}
      pb={{ base: 5, md: 0 }}
      mt={{ base: "auto", md: "auto" }}
      rounded={{ base: "0", md: "32px" }}
      roundedTop={{ base: "3xl", md: "32px" }}
      // Mobile: constrain to viewport height minus iOS safe areas (notch, home indicator)
      // Desktop: limit to 80% viewport height
      maxHeight={{
        base: "calc(98vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))",
        md: "80vh",
      }}
      maxWidth={{
        base: "100%",
        md: "36rem",
      }}
      // Auto height allows modal to grow naturally with content without unnecessary scrolling
      height={{ base: "auto", md: "auto" }}
      // Enable vertical scrolling only when content exceeds available height
      overflowY={{ base: "auto", md: "auto" }}
      {...others}
    >
      {children}
    </ModalContent>
  );
};
