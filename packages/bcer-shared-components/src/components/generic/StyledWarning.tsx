import { StyledWarningProps } from '@/constants/interfaces/genericInterfaces';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import React from 'react'

const PREFIX = 'StyledWarning';

const classes = {
  root: `${PREFIX}-root`,
  icon: `${PREFIX}-icon`,
  text: `${PREFIX}-text`
};

const StyledBox = styled(Box)((
  {
    theme
  }
) => ({
  [`&.${classes.root}`]: {
    padding: '11px',
    backgroundColor: '#FAF3CA',
    border: '2px solid #F9F1C6',
    borderRadius: '4px',
    marginTop: '10px',
    marginBottom: '10px',
  },

  [`& .${classes.icon}`]: {
    color: '#785400',
    fontSize: '22px',
  },

  [`& .${classes.text}`]: {
    color: '#785400',
    fontSize: '16px',
    lineHeight: '22px',
    marginLeft: '10px',
    fontWeight: 'bold',
  }
}));

export function StyledWarning({text, textProps = {}, iconProps = {}, rootProps= {}}: StyledWarningProps) {

  return (
    <StyledBox className={classes.root} display='flex' alignItems='center' {...rootProps}>
      <ErrorIcon className={classes.icon} {...iconProps}/>
      <Typography className={classes.text} {...textProps}>{text}</Typography>
    </StyledBox>
  );
}
