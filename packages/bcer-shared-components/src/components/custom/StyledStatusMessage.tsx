import { Box, makeStyles } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { StyledErrorIcon, StyledSuccessIcon } from '../icons';


const PREFIX = 'StyledStatusMessage';

const classes = {
  error: `${PREFIX}-error`,
  warning: `${PREFIX}-warning`,
  success: `${PREFIX}-success`
};

const StyledBox = styled(Box)(() => ({
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
  }
}));

export interface StyledStatusMessage {
  status: 'error' | 'warning' | 'success';
  message: React.ReactNode;
}

export function StyledStatusMessage({ status, message }: StyledStatusMessage) {

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
    <StyledBox display={'flex'} alignItems={'center'} bgcolor={backgroundColor} p={1.5} >
      {status === 'error' && <StyledErrorIcon />}
      {status === 'success' && <StyledSuccessIcon />}
      {status === 'warning' && <span>Not Implemented</span>}
      <Box p={0.5}/>
      <Box className={classes[status]}>{message}</Box>
    </StyledBox>
  );
}