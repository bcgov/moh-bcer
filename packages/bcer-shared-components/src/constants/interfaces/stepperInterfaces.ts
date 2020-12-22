import { SvgIconTypeMap } from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";

export interface StyledStepperProps {
  steps: Array<StepperStepProps>
  activeStep: number;
}

export interface StepperStepProps {
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  label: string;
}