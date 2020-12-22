
import React, { ReactElement } from 'react';
import {  } from '@material-ui/styles';
import { 
  styled,
  makeStyles, 
  Stepper,
  Step, 
  StepLabel, 
  StepIconProps, 
  StepConnector 
} from '@material-ui/core';

import { StyledStepperProps, StepperStepProps } from '@/constants/interfaces/stepperInterfaces';

const useStyles = makeStyles({
  stepperGroup: {
    backgroundColor: 'transparent',
    padding: '0px 0px 30px 0px',
  },
  stepLabel: {
    alignItems: 'flex-start',
    '& .MuiStepLabel-label': {
      color: '#424242',
      fontSize: '12px',
      textAlign: 'left',
      maxWidth: '115px',
      '&.MuiStepLabel-active': {
        color: '#3A3A3A',
        fontWeight: 600,
      },
    }
  },
  activeIconWrapper: {
    display: 'flex',
    width: '50px',
    height: "50px",
    borderRadius: '30px',
    backgroundColor: '#0053A4',
    justifyContent: 'center',
    alignItems: 'center'
  },
  activeIcon: {
    color: '#fff'
  },
  inactiveIconWrapper: {
    display: 'flex',
    width: '46px',
    height: "46px",
    border: '2px solid #0053A4',
    borderRadius: '30px',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inactiveIcon: {
    color: '#0053A4'
  }
});

/**
 * Uses react styled() to apply styles to the step connector component
 * @returns A Material-UI ReactElement with specified styles
 */
const StyledStepConnector = styled(StepConnector)({
  top: '23px',
  left: 'calc(-100% + 80px)',
  right: 'calc(100% + 15px)',
  '& .MuiStepConnector-lineHorizontal': {
    borderBottom: '5px dotted #0053A4',
    borderTop: 'none',
  }
});

/**
 * 
 * @param {StepIconProps} props -  MUI defined StepIconProps
 * @param {StepperStepProps} step - Stepper icon and text label
 * @returns object of type ReactElement - the step icon based on props.active state
 */
function getStepIcon(props: StepIconProps, step: StepperStepProps) {
  const classes = useStyles();

  const { active } = props;
  const StepIcon = step.icon;

  return(
    active 
      ? <div className={classes.activeIconWrapper}>
          <StepIcon className={classes.activeIcon} />
        </div>
      : <div className={classes.inactiveIconWrapper}>
          <StepIcon className={classes.inactiveIcon} />
        </div>
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
export function StyledStepper ({
activeStep,
steps,
...props
}: StyledStepperProps):ReactElement {
  const classes = useStyles({});

  return (
    <Stepper 
      alternativeLabel
      className={classes.stepperGroup}
      activeStep={activeStep} 
      connector={<StyledStepConnector/>} 
      {...props}
    >
      {
        steps.map((element: StepperStepProps) => (
          <Step key={element.label}>
            <StepLabel
              className={classes.stepLabel}
              StepIconComponent={(props) => getStepIcon(props, element)}
            >
              {element.label}
            </StepLabel>
          </Step>
        ))
      }
    </Stepper>
  );
}