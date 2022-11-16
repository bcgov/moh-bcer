import {
  AppBar,
  Box,
  makeStyles
} from '@material-ui/core';
import React from 'react';
import AppMenu from './AppMenu';
import Logout from './Logout';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: '#F1F1F1',
    boxShadow: 'none',
    width: '100%',
    padding: '10px 30px',
  },
  indicator: {
    '& .MuiTabs-indicator:selected': {
      backgroundColor: '#fff',
    },
  },
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
}));

function Navigator() {
  const classes = useStyles();

  return (
    <div>
      <AppBar position="static" className={classes.appBar}>
        <Box display="flex" justifyContent="space-between">
          <Box display="flex">           
            <AppMenu orientation = "horizontal" />
          </Box>
          <Logout variant='dialog-cancel' />          
        </Box>
      </AppBar>
    </div>
  );
}

export default Navigator;
