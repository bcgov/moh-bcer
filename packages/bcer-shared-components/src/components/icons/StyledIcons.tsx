import React from 'react';
import { styled } from '@mui/material/styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const classes = {
  root: {
    padding: '11px',
    backgroundColor: '#FAF3CA',
    border: '2px solid #F9F1C6',
    borderRadius: '4px',
    marginTop: '10px',
    marginBottom: '10px',
  },
  error: {
    backgroundColor: 'red',
  },
  success: {
    backgroundColor: '#2E8540'
  }
};

const Root = styled('span')(() => ({
  [`& .${classes.root}`]: {
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    display: 'flex',
    width: '48px',
    height: '48px',
    borderRadius: '4px'
  },

  [`& .${classes.error}`]: {
    backgroundColor: 'red',
  },

  [`& .${classes.success}`]: {
    backgroundColor: '#2E8540'
  }
}));

export function StyledErrorIcon() {
  return (
    <Root sx={classes.error}>
      <ErrorOutlineIcon sx={classes.root} />
    </Root>
  );
}

export function StyledSuccessIcon() {
  return (
    <Root sx={classes.success}>
      <CheckCircleIcon sx={classes.root} />
    </Root>
  )
}