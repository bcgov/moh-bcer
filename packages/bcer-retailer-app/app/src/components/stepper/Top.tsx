import React from 'react';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core';

import { StyledStepper } from 'vaping-regulation-shared-components';
import WorkOutlineOutlinedIcon from '@material-ui/icons/WorkOutlineOutlined';
import MapOutlinedIcon from '@material-ui/icons/MapOutlined';

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
