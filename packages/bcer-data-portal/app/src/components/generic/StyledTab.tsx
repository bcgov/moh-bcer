import React from 'react';
import { Tab, Tabs, TabProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '17px',
  lineHeight: '22px',
  minWidth: 72,
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(4),
  '&:hover': {
    color: '#0053A4',
    opacity: 1,
  },
  '&.Mui-selected': {
    color: '#0053A4',
    fontWeight: 'bold',
  },
  '&:focus': {
    color: '#0053A4',
  },
}));

export const StyledTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    backgroundColor: '#f1f1f1',
  },
});