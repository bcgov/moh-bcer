import { Tooltip, withStyles } from '@material-ui/core';
import React from 'react'

export const StyledToolTip = withStyles((theme) => ({
  tooltip: {
    fontSize: 14,
  },
}))(Tooltip);