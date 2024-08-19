import React, { useContext } from "react";
import { styled } from '@mui/material/styles';
import { StyledTab, StyledTabs } from "../generic/StyledTab";
import { routes } from '@/constants/routes';
import { useNavigate, useLocation } from "react-router-dom";
import { ConfigContext } from "@/contexts/Config";

const StyledTabsWrapper = styled(StyledTabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: '#f1f1f1',
  },
}));

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

type RouteValue = typeof routes[keyof typeof routes];

function setInitial(path: string): RouteValue {
  if (Object.values(routes).includes(path as RouteValue)) {
    return path as RouteValue;
  } else {
    return routes.root;
  }
}

interface AppMenuProps {
  orientation: "vertical" | "horizontal"
}

const AppMenu = ({ orientation } : AppMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState<RouteValue>(setInitial(location.pathname));
  const { config } = useContext(ConfigContext);
    
  const handleChange = (event: React.SyntheticEvent, newValue: RouteValue) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <StyledTabsWrapper
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
        {...a11yProps(5)}
        value={routes.mapMenu}
      />          
      {config.permissions.SEND_TEXT_MESSAGES && (
        <StyledTab
          disableRipple
          label="Report"
          {...a11yProps(6)}
          value={routes.report}
        />
      )}        
    </StyledTabsWrapper>
  )
}

export default AppMenu;