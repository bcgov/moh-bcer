import React from 'react';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material';

import { StyledStepper } from 'vaping-regulation-shared-components';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';

type StepperTopProps = {
  steps: Array<{
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    label: string,
    path: string,
  }>,
  currentStep: number;
}

export default function Top({
  steps,
  currentStep
}: StepperTopProps) {

  return (
    <StyledStepper
      activeStep={currentStep}
      steps={steps}
    />
  )
}
