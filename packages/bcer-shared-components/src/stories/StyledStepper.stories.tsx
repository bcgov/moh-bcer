import React, { useState } from 'react';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';

import { StyledStepper } from '@/index';
import { StyledDialogActions } from '@/index';

export default { title: 'Mui Styled Stepper' }

const steps = [
  {
    icon: WorkOutlineIcon,
    label: 'Business Details',
  },
  {
    icon: WorkOutlineIcon,
    label: 'Confirm Locations',
  },
  {
    icon: WorkOutlineIcon,
    label: 'Notification Settings',
  },
  {
    icon: WorkOutlineIcon,
    label: 'Confirm Business Details and Submit',
  },
]

export const Stepper = () => {
  const [step, setStep] = useState<number>(0)

  return (
    <div>
      <StyledStepper
        steps={steps}
        activeStep={step}
      />
      <StyledDialogActions 
        cancelButtonText="Back"
        cancelHandler={() => setStep(step - 1)}
        acceptButtonText="Next"
        acceptHandler={() => setStep(step + 1)}
        cancelDisabled={step === 0}
        acceptDisabled={step === steps.length-1}
      />
    </div>
  )
}