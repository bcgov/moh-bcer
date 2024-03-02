
import React, { ReactElement } from 'react';
import { DialogActions, styled } from '@mui/material';
import { useFormikContext } from 'formik';

import { StyledButton } from '@/index';
import { StyledDialogActionProps } from '@/constants/interfaces/dialogInterfaces';

/**
 * Uses react styled() to apply styles to the dialog actions component
 * @returns A Material-UI ReactElement with specified styles
 */
const StyledActions = styled(DialogActions)({
  padding: '16px 0px 24px 0px',
  margin: '0px 24px 0px 24px',
  borderTop: '1px solid #CCCCCC'
});

/**
 * Styled dialog actions reusable component
 *
 * @param {DialogActionsProps} props - MUI defined dialog action props
 * @param cancelButtonText - `string` the cancel dialog action's text
 * @param acceptButtonText - `string` the accept dialog action's text
 * @param cancelHandler - `function` handler for the cancel dialog action
 * @param acceptHandler - `function | "submit"` handler for the cancel dialog action OR submit type action for form dialog
 * @param cancelDisabled - `optional | default false` boolean flag for button disabled state
 * @param acceptDisabled - `optional | default false` boolean flag for button disabled state
 * @returns object of type ReactElement
 *
 */
export function StyledDialogActions ({
  cancelButtonText,
  acceptButtonText,
  cancelHandler,
  acceptHandler,
  cancelDisabled = false,
  acceptDisabled = false
}: StyledDialogActionProps):ReactElement {
  
  let submitHandler;
  if (acceptHandler === "submit") {
    let { submitForm } = useFormikContext()
    submitHandler = submitForm;
  }
  
  return (
      <StyledActions style={{justifyContent: !acceptHandler || !cancelHandler ? 'flex-end' : 'space-between' }}>
        <StyledButton 
          variant="dialog-cancel"
          onClick={cancelHandler}
          disabled={cancelDisabled}
        >
          {cancelButtonText}
        </StyledButton>
        {
          acceptHandler === "submit"
            ? <StyledButton 
                variant="dialog-accept"
                onClick={submitHandler}
                disabled={acceptDisabled}
              >
                {acceptButtonText}
              </StyledButton>
            : 
              acceptHandler 
                ? <StyledButton 
                    variant="dialog-accept"
                    onClick={acceptHandler}
                    disabled={acceptDisabled}
                  >
                    {acceptButtonText}
                  </StyledButton>
                : null
        }
      </StyledActions>
  );
}