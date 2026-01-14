import { useMediaQuery as chakraUseMediaQuery, UseMediaQueryOptions } from "@chakra-ui/react";

/**
 * Wrapper around Chakra UI's useMediaQuery that defaults ssr to false.
 * This avoids having to specify { ssr: false } in every usage.
 */
export const useMediaQuery = (
  query: string | string[],
  options?: Omit<UseMediaQueryOptions, "ssr">
) => {
  return chakraUseMediaQuery(query, { ...options, ssr: false });
};
