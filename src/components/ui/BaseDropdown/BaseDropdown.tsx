import { themeColors } from "@/theme/colors";
import { Select, SelectProps } from "@chakra-ui/react";
import i18next from "i18next";

interface Option<T> {
  value: T;
  label: string;
}

interface BaseDropdownProps<T> extends Omit<SelectProps, "value" | "onChange"> {
  options: Option<T>[];
  value: T | "all";
  onChange: (value: T | "all") => void;
  allOptionLabel?: string;
  allOption?: boolean;
}

export const BaseDropdown = <T extends string | number>({
  options,
  value,
  onChange,
  allOptionLabel = i18next.t("All"),
  allOption = true,
  ...props
}: BaseDropdownProps<T>) => {
  return (
    <Select
      value={value}
      onChange={(e) => {
        const newValue =
          e.target.value === "all"
            ? "all"
            : typeof options[0]?.value === "number"
              ? (Number(e.target.value) as T)
              : (e.target.value as T);
        onChange(newValue);
      }}
      borderRadius="full"
      bg={themeColors.input.background}
      border={`1px solid ${themeColors.input.border}`}
      w={{ base: "full", md: "max-content" }}
      _focus={{ outline: "none", boxShadow: "none" }}
      _focusVisible={{ outline: "none", boxShadow: "none" }}
      sx={{
        "&:focus": {
          outline: "none !important",
          boxShadow: "none !important",
        },
        "&:focus-visible": {
          outline: "none !important",
          boxShadow: "none !important",
        },
      }}
      {...props}
    >
      {allOption && <option value="all">{allOptionLabel}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
};
