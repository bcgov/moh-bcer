import React from 'react';
import { Tooltip, TooltipProps } from '@mui/material';
import { styled } from '@mui/system';

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    fontSize: 14,
  },
}));

export default StyledTooltip;