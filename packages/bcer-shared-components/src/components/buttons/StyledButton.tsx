
import React, { ReactElement, Fragment } from 'react';
import { styled, Button } from '@mui/material';
import { StyledButtonProps } from '@/constants/interfaces/buttonInterfaces';

/**
 * Uses react styled() to apply styles to the button component
 * @returns A  ReactElement with specified styles
 */
const StyledContainedButton = styled(Button)({
  minWidth: '250px',
  backgroundColor: '#002C71',
  color: '#fff',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 500,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#2e6ead',
    boxShadow: 'none',
  }
});

/**
 * Uses react styled() to apply styles to the button component
 * @returns A Material-UI ReactElement with specified styles
 */
const StyledOutlinedButton = styled(Button)({
  minWidth: '250px',
  color: '#234075',
  textTransform: 'none',
  border: '1px solid #234075',
  fontSize: '16px',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#e6efff',
    boxShadow: 'none',
  }
});

/**
 * Uses react styled() to apply styles to the button component
 * @returns A Material-UI ReactElement with specified styles
 */
const StyledSmallOutlinedButton = styled(Button)({
  minWidth: '100px',
  color: '#234075',
  textTransform: 'none',
  border: '1px solid #234075',
  fontSize: '13px',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#e6efff',
    boxShadow: 'none',
  }
})

/**
 * Uses react styled() to apply styles to the button component
 * @returns A Material-UI ReactElement with specified styles
 */
 const StyledSmallContainedButton = styled(Button)({
  minWidth: '100px',
  backgroundColor: '#002C71',
  padding: '5px 45px',
  color: '#fff',
  textTransform: 'none',
  fontSize: '13px',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#2e6ead',
    boxShadow: 'none',
  }
});

/**
 * Uses react styled() to apply styles to the button component
 * @returns A Material-UI ReactElement with specified styles
 */
const StyledTextButton = styled(Button)({
  color: '#234075',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#e6efff',
    boxShadow: 'none',
  }
});

/**
 * Uses react styled() to apply styles to the button component
 * @returns A Material-UI ReactElement with specified styles
 */
const StyledDialogCancelButton = styled(Button)({
  padding: '5px 45px',
  color: '#234075',
  textTransform: 'none',
  border: '1px solid #234075',
  fontSize: '16px',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#e6efff',
    boxShadow: 'none',
  }
});

/**
 * Uses react styled() to apply styles to the button component
 * @returns A Material-UI ReactElement with specified styles
 */
const StyledDialogAcceptButton = styled(Button)({
  backgroundColor: '#002C71',
  padding: '5px 45px',
  color: '#fff',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#2e6ead',
    boxShadow: 'none',
  }
});

/**
 * Uses react styled() to apply styles to the button component
 * @returns A Material-UI ReactElement with specified styles
 */
const StyledTableButton = styled(Button)({
  color: '#234075',
  backgroundColor: '#e6efff',
  textTransform: 'none',
  fontSize: '14px',
  fontWeight: 600,
  boxShadow: 'none',
  padding: '5px 15px',
  '&:hover': {
    backgroundColor: '#d6dfff',
    boxShadow: 'none',
  }
})

/**
 * Styled button reusable component
 *
 * @param {ButtonProps} props - MUI defined button props
 * @returns object of type ReactElement
 *
 */
export function StyledButton ({ variant, ...props }: StyledButtonProps):ReactElement {

  return (
    <Fragment>
      {
        variant === 'contained'
          ? <StyledContainedButton
              variant="contained"
              {...props}
            />
        : variant === 'outlined' 
          ? <StyledOutlinedButton
              variant="outlined"
              {...props}
            />
        : variant === 'dialog-accept' 
          ? <StyledDialogAcceptButton
              variant="contained"
              {...props}
            />
        : variant === 'dialog-cancel' 
          ? <StyledDialogCancelButton
              variant="outlined"
              {...props}
            />
        : variant === 'table'
          ? <StyledTableButton
              variant="text"
              {...props}
            />
        : variant === 'small-outlined'
          ? <StyledSmallOutlinedButton 
              variant="outlined"
              size='small'
              {...props}
          /> 
        : variant === 'small-contained'
          ? <StyledSmallContainedButton 
              variant='contained'
              size='small'
              {...props}
          />
        :<StyledTextButton
          variant="text"
            {...props}
          />
      }
    </Fragment>
  );
}