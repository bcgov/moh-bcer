import { Tooltip, withStyles } from '@material-ui/core';
import React from 'react'

const StyledToolTip = withStyles((theme) => ({
  tooltip: {
    fontSize: 14,
  },
}))(Tooltip);

export default StyledToolTip
