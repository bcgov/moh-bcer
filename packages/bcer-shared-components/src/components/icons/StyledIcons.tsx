import React, { Children } from 'react';
import { Box, makeStyles } from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const useStyle = makeStyles(() => ({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    display: 'flex',
    width: '48px',
    height: '48px',
  },
  error: {
    backgroundColor: 'red',
  },
  success: {
    backgroundColor: '#16C92E'
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
      <ErrorOutlineIcon />
    </span>
  )
}