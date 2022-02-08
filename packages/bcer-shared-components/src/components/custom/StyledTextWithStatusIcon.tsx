import { Box, BoxProps, makeStyles } from '@material-ui/core';
import React from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

export type TextWithStatusIconProps = {
  text: React.ReactNode;
  success: boolean;
  textProps?: BoxProps;
  iconProps?: Object;
};

const useStyles = makeStyles(() => ({
  box: {
    display: 'flex',
    alignItems: 'center',
  },
  text: {
    color: '#333333',
    fontSize: '14px',
  },
  successIcon: {
    color: '#52C41A',
  },
  errorIcon: {
    color: '#FAAD14',
  },
}));

export function StyledTextWithStatusIcon({
  text,
  success,
  textProps = {},
  iconProps = {},
}: TextWithStatusIconProps) {
  const classes = useStyles();
  return (
    <Box className={classes.box}>
      {success ? (
        <CheckCircleIcon className={classes.successIcon} {...iconProps}/>
      ) : (
        <ErrorIcon className={classes.errorIcon} {...iconProps}/>
      )}
      <Box ml={1} />
      <Box className={classes.text} {...textProps}>{text}</Box>
    </Box>
  );
}