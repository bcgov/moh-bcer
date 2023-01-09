
import makeStyles from "@material-ui/core/styles/makeStyles";
import React, { useContext } from "react";
import { StyledTab, StyledTabs } from "../generic/StyledTab";
import { routes } from '@/constants/routes';
import { useHistory } from "react-router";
import { ConfigContext } from "@/contexts/Config";

const useStyles = makeStyles((theme) => ({
    indicator: {
      '& .MuiTabs-indicator:selected': {
        backgroundColor: '#fff',
      },
    },
}));

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function setInitial(path: string) {
  if (Object.values(routes).includes(path)) {
    return path;
  } else {
    return routes.root;
  }
}

interface AppMenuProps {
  orientation: "vertical" | "horizontal"
}

const AppMenu = ({ orientation } : AppMenuProps) => {
  const history = useHistory();
  const classes = useStyles();
  const [value, setValue] = React.useState(setInitial(history.location.pathname));
  const { config } = useContext(ConfigContext);
    
  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
    history.push(newValue);
  };

  return (
    <StyledTabs
      className={classes.indicator}
      value={value}
      onChange={handleChange}
      textColor="primary"
      aria-label="icon tabs example"        
      orientation={orientation}
    >
      <StyledTab 
        disableRipple
        label="Dashboard"
        {...a11yProps(0)}
        value={routes.root}
      />
      {config.permissions.MANAGE_LOCATIONS && (
        <StyledTab
          disableRipple
          label="Submitted Locations"
          {...a11yProps(1)}
          value={routes.submittedLocations}
        />
      )}
      {config.permissions.MANAGE_USERS && (
        <StyledTab
          disableRipple
          label="User Management"
          {...a11yProps(2)}
          value={routes.userManagement}
        />
      )}
      <StyledTab
        disableRipple
        label="FAQ Management"
        {...a11yProps(3)}
        value={routes.FAQManagement}
      />
      {config.permissions.SEND_TEXT_MESSAGES && config.featureFlags.TEXT_MESSAGES && (
        <StyledTab
          disableRipple
          label="Send Notification"
          {...a11yProps(4)}
          value={routes.sendNotification}
        />
      )}              
      <StyledTab
        disableRipple
        label="Map"
        {...a11yProps(4)}
        value={routes.mapMenu}
      />              
    </StyledTabs>)
}

export default AppMenu;