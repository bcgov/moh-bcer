import React from 'react';
import { styled } from '@mui/material/styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PREFIX = 'StyledIcons';

const classes = {
  root: `${PREFIX}-root`,
  error: `${PREFIX}-error`,
  success: `${PREFIX}-success`
};

const StyledSpan = styled('span')(({ theme }) => ({
  [`&.${classes.root}`]: {
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    display: 'flex',
    width: '48px',
    height: '48px',
    borderRadius: '4px'
  },
  [`&.${classes.error}`]: {
    backgroundColor: 'red',
  },
  [`&.${classes.success}`]: {
    backgroundColor: '#2E8540'
  }
}));

export function StyledErrorIcon() {
  return (
    <StyledSpan className={`${classes.root} ${classes.error}`}>
      <ErrorOutlineIcon />
    </StyledSpan>
  );
}

export function StyledSuccessIcon() {
  return (
    <StyledSpan className={`${classes.root} ${classes.success}`}>
      <CheckCircleIcon />
    </StyledSpan>
  );
}