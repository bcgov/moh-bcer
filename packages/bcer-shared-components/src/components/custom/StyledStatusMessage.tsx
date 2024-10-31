import React from 'react';
import { Box, styled } from '@mui/material';
import { StyledErrorIcon, StyledSuccessIcon } from '../icons';

const PREFIX = 'StyledStatusMessage';

const classes = {
  error: `${PREFIX}-error`,
  warning: `${PREFIX}-warning`,
  success: `${PREFIX}-success`,
};

const StyledBox = styled(Box)(({ theme }) => ({
  [`& .${classes.error}`]: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#FF534A',
  },
  [`& .${classes.warning}`]: {},
  [`& .${classes.success}`]: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2E8540',
  },
}));

export interface StyledStatusMessageProps {
  status: 'error' | 'warning' | 'success';
  message: React.ReactNode;
}

export function StyledStatusMessage({ status, message }: StyledStatusMessageProps) {
  let backgroundColor = 'none';
  switch (status) {
    case 'error':
      backgroundColor = 'rgba(216,41,47,0.1)';
      break;
    case 'success':
      backgroundColor = 'rgba(41,216,47,0.1)';
      break;
    case 'warning':
      break;
    default:
      break;
  }

  return (
    <StyledBox
      display="flex"
      alignItems="center"
      sx={{ backgroundColor }}
      p={1.5}
    >
      {status === 'error' && <StyledErrorIcon />}
      {status === 'success' && <StyledSuccessIcon />}
      {status === 'warning' && <span>Not Implemented</span>}
      <Box p={0.5} />
      <Box className={classes[status]}>{message}</Box>
    </StyledBox>
  );
}