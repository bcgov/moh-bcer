import { Box, makeStyles } from '@material-ui/core';
import React from 'react';
import { StyledErrorIcon, StyledSuccessIcon } from '../icons';


const useStyles = makeStyles(() => ({
  error: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#FF534A',
  },
  warning: {},
  success: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2E8540',
  },
}));

export interface StyledStatusMessage {
  status: 'error' | 'warning' | 'success';
  message: React.ReactNode;
}

export function StyledStatusMessage({ status, message }: StyledStatusMessage) {
  const classes = useStyles();
  let backgroundColor = 'none';
  switch (status) {
    case 'error':
      backgroundColor = 'rgba(216,41,47,0.1)';
      break;
    case 'success':
      backgroundColor = 'rgba(41,216,47,0.1)'
      break;
    case 'warning':
      break;
    default:
      break;
  }
  return (
    <Box display={'flex'} alignItems={'center'} bgcolor={backgroundColor} p={1.5} >
      {status === 'error' && <StyledErrorIcon />}
      {status === 'success' && <StyledSuccessIcon />}
      {status === 'warning' && <span>Not Implemented</span>}
      <Box p={0.5}/>
      <Box className={classes[status]}>{message}</Box>
    </Box>
  );
}