import { FlowStep } from "@/types/flowStep";
import { BackButtonHeader } from "./BackButtonHeader";
import { Text } from "@chakra-ui/react";
interface BackButtonHeaderStepsProps {
  steps: FlowStep[];
  activeStep: number;
  onClickBack: () => void;
  hideAboveStep?: number;
  disabled?: boolean;
}

export const BackButtonHeaderSteps = ({
  activeStep,
  steps,
  onClickBack,
  hideAboveStep = 1, // Non inclusive
  disabled = false,
}: BackButtonHeaderStepsProps) => {
  if (activeStep > hideAboveStep) return <></>;
  return (
    <BackButtonHeader disabled={disabled} onClickBack={onClickBack}>
      <Text cursor={disabled ? "default" : "pointer"} color="white" fontSize="2xl">
        {steps[activeStep]?.title ?? ""}
      </Text>
    </BackButtonHeader>
  );
};
