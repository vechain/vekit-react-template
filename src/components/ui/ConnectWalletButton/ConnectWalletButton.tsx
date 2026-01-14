import { Button, ButtonProps } from "@chakra-ui/react";
import { useDAppKitWalletModal } from "@vechain/vechain-kit";
import { useTranslation } from "react-i18next";

export const ConnectWalletButton = ({ children, ...props }: ButtonProps) => {
  const { open } = useDAppKitWalletModal();
  const { t } = useTranslation();

  return (
    <Button onClick={open} variant="actionButton" {...props}>
      {children ?? t("Connect Wallet")}
    </Button>
  );
};
