import {
  AppBar,
  Box,
  makeStyles,
  Typography,
  Toolbar,
  Tabs,
  Tab,
} from '@material-ui/core';
import { TabPanel } from '@material-ui/lab';
import { withStyles } from '@material-ui/styles';
import React from 'react';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: '#F1F1F1',
    boxShadow: 'none',
    width: '100%',
  },
  indicator:{
      '& .MuiTabs-indicator:selected':{
          backgroundColor: '#fff'
      }
  }
}));

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const AntTabs = withStyles({
    indicator: {
        backgroundColor: '#fff',
      },
})(Tabs);

function Navigator() {
  const classes = useStyles();
  const history = useHistory();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
    history.push(newValue);
  };
  return (
    <div>
      <AppBar position="static" className={classes.appBar}>
        <Box display="flex">
          <Box>
            <AntTabs
            className= {classes.indicator}
              value={value}
              onChange={handleChange}
              textColor="primary"
              aria-label="icon tabs example"
            >
              <Tab disableRipple label={<div style={{color: 'red'}}>Hello world</div>} {...a11yProps(0)} value='/user'/>
              <Tab disableRipple label="Item Two" {...a11yProps(1)} value='/'/>
            </AntTabs>
          </Box>
          <Box>
              <Typography>Log out</Typography>
            </Box>
        </Box>
      </AppBar>
    </div>
  );
}

export default Navigator;
