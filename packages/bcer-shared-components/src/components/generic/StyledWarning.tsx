import { StyledWarningProps } from '@/constants/interfaces/genericInterfaces';
import { Box, makeStyles, Typography } from '@material-ui/core'
import ErrorIcon from '@material-ui/icons/Error';
import React from 'react'

const useStyles = makeStyles(theme => ({
  root: {
    padding: '11px',
    backgroundColor: '#FAF3CA',
    border: '2px solid #F9F1C6',
    borderRadius: '4px',
    marginTop: '10px',
    marginBottom: '10px',
  },
  icon:{
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
}))

export function StyledWarning({text, textProps = {}, iconProps = {}, rootProps= {}}: StyledWarningProps) {
  const classes = useStyles();
  return (
    <Box className={classes.root} display='flex' alignItems='center' {...rootProps}>
      <ErrorIcon className={classes.icon} {...iconProps}/>
      <Typography className={classes.text} {...textProps}>{text}</Typography>
    </Box>
  )
}
