import { routes } from '@/constants/routes';
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
import { useKeycloak } from '@react-keycloak/web';
import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { StyledButton } from 'vaping-regulation-shared-components';
import { StyledTab, StyledTabs } from './generic';
import store from 'store';
import { ConfigContext } from '@/contexts/Config';

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

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function Navigator() {
  const classes = useStyles();
  const history = useHistory();
  const [keycloak] = useKeycloak();
  const [value, setValue] = React.useState(history.location.pathname);
  const { config } = useContext(ConfigContext);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
    history.push(newValue);
  };

  const logout = () => {
    store.clearAll();
    keycloak.logout();
    history.push(routes.root);
  };

  return (
    <div>
      <AppBar position="static" className={classes.appBar}>
        <Box display="flex" justifyContent="space-between">
          <Box display="flex">
            <StyledTabs
              className={classes.indicator}
              value={value}
              onChange={handleChange}
              textColor="primary"
              aria-label="icon tabs example"
            >
              {config.permissions.MANAGE_LOCATIONS && (
                <StyledTab
                  disableRipple
                  label="Submitted Locations"
                  {...a11yProps(0)}
                  value={routes.root}
                />
              )}
              {config.permissions.MANAGE_USERS && (
                <StyledTab
                  disableRipple
                  label="User Management"
                  {...a11yProps(1)}
                  value={routes.userManagement}
                />
              )}
                <StyledTab
                  disableRipple
                  label="Get Help"
                  {...a11yProps(2)}
                  value={routes.getHelp}
                />
            </StyledTabs>
          </Box>
          <Box className={classes.buttonWrapper}>
            <StyledButton variant="dialog-cancel" onClick={logout}>
              Log Out
            </StyledButton>
          </Box>
        </Box>
      </AppBar>
    </div>
  );
}

export default Navigator;
