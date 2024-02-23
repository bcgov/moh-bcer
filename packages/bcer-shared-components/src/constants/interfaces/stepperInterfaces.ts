import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

export interface StyledStepperProps {
  steps: Array<StepperStepProps>
  activeStep: number;
}

export interface StepperStepProps {
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  label: string;
}