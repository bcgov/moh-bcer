import { Tooltip, styled } from '@mui/material';

export const StyledToolTip = styled(Tooltip)(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    fontSize: 14,
  },
}));