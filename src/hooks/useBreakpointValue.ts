import {
  useBreakpointValue as chakraUseBreakpointValue,
  UseBreakpointOptions,
} from "@chakra-ui/react";

/**
 * Wrapper around Chakra UI's useBreakpointValue that defaults ssr to false.
 * This avoids having to specify { ssr: false } in every usage.
 */
export const useBreakpointValue = <T = any>(
  values: Record<string, T> | T[],
  options?: Omit<UseBreakpointOptions, "ssr">
) => {
  return chakraUseBreakpointValue(values, { ...options, ssr: false });
};
