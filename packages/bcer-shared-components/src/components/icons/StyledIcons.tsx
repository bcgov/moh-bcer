import React, { Children } from 'react';
import { Box, makeStyles } from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const useStyle = makeStyles(() => ({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    display: 'flex',
    width: '48px',
    height: '48px',
    borderRadius: '4px'
  },
  error: {
    backgroundColor: 'red',
  },
  success: {
    backgroundColor: '#2E8540'
  }
}))

export function StyledErrorIcon() {
  const classes = useStyle();
  return (
    <span className={`${classes.root} ${classes.error}`}>
      <ErrorOutlineIcon />
    </span>
  );
}

export function StyledSuccessIcon() {
  const classes = useStyle();
  return (
    <span className={`${classes.root} ${classes.success}`}>
      <CheckCircleIcon />
    </span>
  )
}