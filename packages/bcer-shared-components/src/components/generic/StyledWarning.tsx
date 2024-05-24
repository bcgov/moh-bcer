import { StyledWarningProps } from '@/constants/interfaces/genericInterfaces';
import { Box, Typography } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import React from 'react'

const classes = {
  root: {
    padding: '11px',
    backgroundColor: '#FAF3CA',
    border: '2px solid #F9F1C6',
    borderRadius: '4px',
    marginTop: '10px',
    marginBottom: '10px',
  },
  icon: {
    color: '#785400',
    fontSize: '22px',
  },
  text: {
    color: '#785400',
    fontSize: '16px',
    lineHeight: '22px',
    marginLeft: '10px',
    fontWeight: 'bold',
  }
};

export function StyledWarning({text, textProps = {}, iconProps = {}, rootProps= {}}: StyledWarningProps) {

  return (
    <Box sx={classes.root} display='flex' alignItems='center' {...rootProps}>
      <ErrorIcon sx={classes.icon} {...iconProps}/>
      <Typography sx={classes.text} {...textProps}>{text}</Typography>
    </Box>
  );
}
