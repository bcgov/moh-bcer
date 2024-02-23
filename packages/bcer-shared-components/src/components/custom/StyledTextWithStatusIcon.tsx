import { Box, BoxProps, makeStyles } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const PREFIX = 'StyledTextWithStatusIcon';

const classes = {
  box: `${PREFIX}-box`,
  text: `${PREFIX}-text`,
  successIcon: `${PREFIX}-successIcon`,
  errorIcon: `${PREFIX}-errorIcon`
};

const StyledBox = styled(Box)(() => ({
  [`&.${classes.box}`]: {
    display: 'flex',
    alignItems: 'center',
  },

  [`& .${classes.text}`]: {
    color: '#333333',
    fontSize: '14px',
  },

  [`& .${classes.successIcon}`]: {
    color: '#52C41A',
  },

  [`& .${classes.errorIcon}`]: {
    color: '#FAAD14',
  }
}));

export type TextWithStatusIconProps = {
  text: React.ReactNode;
  success: boolean;
  textProps?: BoxProps;
  iconProps?: Object;
};

export function StyledTextWithStatusIcon({
  text,
  success,
  textProps = {},
  iconProps = {},
}: TextWithStatusIconProps) {

  return (
    <StyledBox className={classes.box}>
      {success ? (
        <CheckCircleIcon className={classes.successIcon} {...iconProps}/>
      ) : (
        <ErrorIcon className={classes.errorIcon} {...iconProps}/>
      )}
      <Box ml={1} />
      <Box className={classes.text} {...textProps}>{text}</Box>
    </StyledBox>
  );
}