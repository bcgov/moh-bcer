
import React, { ReactElement } from 'react';
import { Dialog, DialogTitle, DialogContent, Slide, styled } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions/transition';

import { StyledDialogProps } from '@/constants/interfaces/dialogInterfaces';
import { StyledDialogActions } from '@/index';

/**
 * Uses react styled() to apply styles to the dialog title component
 * @returns A Material-UI ReactElement with specified styles
 */
const StyledDialogTitle = styled(DialogTitle)({
  padding: '24px 0px 16px 0px',
  margin: '0px 24px 0px 24px',
  borderBottom: '1px solid #CCCCCC',
  color: '#1E5DB1',
  '& .MuiTypography-root': {
    fontSize: '20px',
    fontWeight: 500
  }
});

/**
 * Uses react styled() to apply styles to the dialog content component
 * @returns A Material-UI ReactElement with specified styles
 */
const StyledDialogContent = styled(DialogContent)({
  padding: '16px 24px 16px 24px',

});

/**
 * Transition component - To be consumed by a Dialog's transitionComponent prop
 */
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * Styled dialog reusable component
 *
 * @param {DialogProps} props - MUI defined dialog props
 * @param title - `string` the dialog title component's text
 * @param cancelButtonText - `string` the cancel dialog action's text
 * @param acceptButtonText - `string` the accept dialog action's text
 * @param cancelHandler - `function` handler for the cancel dialog action
 * @param acceptHandler - `function | "submit"` handler for the cancel dialog action OR submit type action for form dialog
 * @returns object of type ReactElement
 *
 */
export function StyledDialog ({
  title,
  cancelButtonText,
  acceptButtonText,
  cancelHandler,
  acceptHandler,
  acceptDisabled,
  cancelDisabled,
  ...props
}: StyledDialogProps):ReactElement {
  
  
  return (
    <Dialog
      TransitionComponent={Transition}
      fullWidth
      {...props}
    >
      <StyledDialogTitle>
        {title}
      </StyledDialogTitle>
      <StyledDialogContent>
        {props.children}
      </StyledDialogContent>
      <StyledDialogActions 
        cancelButtonText={cancelButtonText} 
        cancelHandler={cancelHandler}
        acceptButtonText={acceptButtonText} 
        acceptHandler={acceptHandler}
        acceptDisabled={acceptDisabled || false}
        cancelDisabled={cancelDisabled || false}
      />
    </Dialog>
  );
}