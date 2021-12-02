import React from 'react';
import { Tab, Tabs } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

export const StyledTab = withStyles((theme) => ({
  root: {
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
    '&$selected': {
      color: '#0053A4',
      fontWeight: 'bold',
    },
    '&:focus': {
      color: '#0053A4',
    },
  },
  selected: {},
}))(Tab);

export const StyledTabs = withStyles({
    indicator: {
        backgroundColor: '#f1f1f1',
      },
})(Tabs);