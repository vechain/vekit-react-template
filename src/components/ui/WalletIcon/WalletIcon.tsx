import { AVATAR_FALLBACK_URL } from "@/utils/constants";
import { Avatar } from "@chakra-ui/react";
import { useProfileModal, useWallet } from "@vechain/vechain-kit";

export const WalletIcon = () => {
  const { account } = useWallet();
  const { open } = useProfileModal();

  return (
    <Avatar
      size="sm"
      src={account?.image || `${AVATAR_FALLBACK_URL}/${account?.address ?? ""}`}
      bg="gray"
      borderRadius="full"
      onClick={() => open()}
      cursor="pointer"
    />
  );
};
