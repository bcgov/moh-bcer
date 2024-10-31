
import React, { ReactElement } from 'react';
import { styled, Stepper, Step, StepLabel, StepIconProps, StepConnector } from '@mui/material';
import { StyledStepperProps, StepperStepProps } from '@/constants/interfaces/stepperInterfaces';

const StyledStepLabel = styled(StepLabel)({
  alignItems: 'flex-start',
  color: '#424242',
  fontSize: '12px',
  textAlign: 'left',
  maxWidth: '115px',
  '&.MuiStepLabel-active': {
    color: '#3A3A3A',
    fontWeight: 600,
  },
});

const ActiveIconWrapper = styled('div')({
  display: 'flex',
  width: '50px',
  height: '50px',
  borderRadius: '30px',
  backgroundColor: '#0053A4',
  justifyContent: 'center',
  alignItems: 'center',
});

const InactiveIconWrapper = styled('div')({
  display: 'flex',
  width: '46px',
  height: '46px',
  border: '2px solid #0053A4',
  borderRadius: '30px',
  backgroundColor: 'transparent',
  justifyContent: 'center',
  alignItems: 'center',
});

const StyledStepConnector = styled(StepConnector)({
  top: '23px',
  left: 'calc(-100% + 80px)',
  right: 'calc(100% + 15px)',
  '& .MuiStepConnector-lineHorizontal': {
    borderBottom: '5px dotted #0053A4',
    borderTop: 'none',
  },
});

/**
 * 
 * @param {StepIconProps} props -  MUI defined StepIconProps
 * @param {StepperStepProps} step - Stepper icon and text label
 * @returns object of type ReactElement - the step icon based on props.active state
 */
function getStepIcon(props: StepIconProps, step: StepperStepProps) {
  const { active } = props;
  const StepIcon = step.icon;

  return (
    active
      ? <ActiveIconWrapper>
          <StepIcon sx={{ color: '#fff' }} />
        </ActiveIconWrapper>
      : <InactiveIconWrapper>
          <StepIcon sx={{ color: '#0053A4' }} />
        </InactiveIconWrapper>
  );
}

/**
 * Styled stepper reusable component
 *
 * @param activeStep - `number` zero-based index of current active step
 * @param {Array<StepperStepProps>}steps - `Array<StepperStepProps>` array of stepper props
 * @param steps.icon - `MUI Icon` Material UI Icon ref
 * @param steps.label - `string` text for the step's label
 * @returns object of type ReactElement
 *
 */
export function StyledStepper({
  activeStep,
  steps,
  ...props
}: StyledStepperProps): ReactElement {
  return (
    <Stepper
      alternativeLabel
      sx={{ backgroundColor: 'transparent', padding: '0px 0px 30px 0px' }}
      activeStep={activeStep}
      connector={<StyledStepConnector />}
      {...props}
    >
      {steps.map((element: StepperStepProps) => (
        <Step key={element.label}>
          <StyledStepLabel
            StepIconComponent={(props) => getStepIcon(props, element)}
          >
            {element.label}
          </StyledStepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
