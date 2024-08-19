import React, { useEffect, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import store from 'store';
import { useKeycloak } from '@react-keycloak/web';
import { useAxiosGet } from '@/hooks/axios';
import {
  CheckCircleOutlineOutlined,
  FiberManualRecordOutlined,
  ErrorOutline,
} from '@mui/icons-material';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import userSignOutLogo from '@/assets/images/sign-out.png';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';

const PREFIX = 'SideNav';

const classes = {
  sideNav: `${PREFIX}-sideNav`,
  listGroup: `${PREFIX}-listGroup`,
  listItem: `${PREFIX}-listItem`,
  listLabel: `${PREFIX}-listLabel`,
  activeLabel: `${PREFIX}-activeLabel`,
  listIcon: `${PREFIX}-listIcon`,
  activeIcon: `${PREFIX}-activeIcon`,
  signOutIcon: `${PREFIX}-signOutIcon`,
  signOutText: `${PREFIX}-signOutText`,
  logoutContainer: `${PREFIX}-logoutContainer`,
  errorIcon: `${PREFIX}-errorIcon`
};

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.sideNav}`]: {
    position: 'relative',
    maxWidth: '360px',
    minWidth: '360px',
    width: '360px',
    borderWidth: '0px 1px 0px 1px',
    borderStyle: 'solid',
    borderColor: '#CDCED2'
  },
  [`& .${classes.listGroup}`]: {
    maxWidth: '360px',
    height: '100%',
    width: '360px',
    position: 'fixed',
    paddingTop: '70px',
  },
  [`& .${classes.listItem}`]: {
    padding: '0px',
    marginBottom: '0px',
    height: '70px',
    '& .MuiListItemButton-root': {
      height: '100%',
    }
  },
  [`& .${classes.listLabel}`]: {
    flex: 'none',
    '& .MuiTypography-root': {
      whiteSpace: 'nowrap',
      fontSize: '20px',
      color: "rgba(51, 51, 51, 0.5)"
    }
  },
  [`& .${classes.activeLabel}`]: {
    '& .MuiTypography-root': {
      color: '#424242',
      fontWeight: 600
    }
  },
  [`& .${classes.listIcon}`]: {
    fontSize: '30px !important',
    padding: '0px 24px 0px 24px',
    marginBottom: '0px !important',
  },
  [`& .${classes.activeIcon}`]: {
    color: '#002C71'
  },
  [`& .${classes.signOutIcon}`]: {
    marginBottom: '0px !important',
    padding: '0px 26px 0px 26px',
  },
  [`& .${classes.signOutText}`]: {
    fontSize: '20px',
    color: "rgba(51, 51, 51, 0.5)",
  },
  [`& .${classes.logoutContainer}`]: {
    minWidth: '360px',
    height: '70px',
    position: 'absolute',
    bottom: '250px',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      background: '#EEEEEE',
      cursor: 'pointer',
    },
  },
  [`& .${classes.errorIcon}`]: {
    minWidth: '0px',
    padding: '0px 10px 0px 10px'
  }
}));

interface IconProps { 
  formStep: 'myDashboard' | 'myBusiness' | 'noi' | 'productReport' | 'manufacturingReport' | 'salesReports' | 'userGuide' 
}

export default function SideNav() {
  const { pathname } = useLocation();
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  
  const logout = () => {
    store.clearAll();
    keycloak.logout();
  };

  const [{ data: status, error }] = useAxiosGet(`/users/status`);
  const [{ data: config, error: configError }] = useAxiosGet('/users/config');

  useEffect(() => {
    if (status && !error) {
      setAppGlobal({
        ...appGlobal,
        ...status,
      })
    }
  }, [status]);

  useEffect(() => {
    if(config && !configError){
      setAppGlobal({
        ...appGlobal,
        config,
      })
    }
  }, [config])
  
  useEffect(() => {
    if (error) {
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(error)})
    }
  }, [error])

  const NavItem: React.FC<IconProps> = ({ formStep }) => {
    let completedStep = false;
    let pathName = '/';
    let stepTitle = '';
    let href = '';
    let showWarningIcon = true;
    
    switch (formStep) {
      case 'myDashboard':
        completedStep = appGlobal.myBusinessComplete;
        pathName = '/myDashboard';
        stepTitle = 'My Dashboard';
        // href = sideNav.myBusinessComplete ? '/mybusiness' : '/business/details'
        href = '/myDashboard'
        break;
      case 'myBusiness':
        completedStep = appGlobal.myBusinessComplete;
        pathName = '/business';
        stepTitle = 'My Business';
        // href = sideNav.myBusinessComplete ? '/mybusiness' : '/business/details'
        href = '/business/details'
        break;
      case 'noi':
        completedStep = appGlobal.noiComplete;
        pathName = '/noi';
        stepTitle = 'NOI';
        // href = sideNav.myBusinessComplete ? '/noi' : null;
        href = '/noi';
        break;
      case 'productReport':
        completedStep = appGlobal.productReportComplete;
        pathName = '/products';
        stepTitle = 'Product Reports';
        // href = sideNav.noiComplete ? '/products' : null;
        href = '/products';
        break;
      case 'manufacturingReport':
        completedStep = appGlobal.manufacturingReportComplete;
        pathName = '/manufacturing';
        stepTitle = 'Manufacturing Reports';
        // href = sideNav.productReportComplete ? '/manufacturing' : null;
        href = '/manufacturing';
        break;
      case 'salesReports':
        pathName = '/sales';
        stepTitle = 'Sales Reports';
        href = '/sales';
        showWarningIcon = false;
        break;
      case 'userGuide':
        completedStep = appGlobal.userGuideComplete;
        pathName = '/userguide';
        stepTitle = 'BCER User Guide';
        showWarningIcon = false;
        break;
    }

    if (formStep === 'userGuide') {
      const filePath = process.env.NODE_ENV === 'development' 
        ? '/BCER User Guide (2023).pdf'
        : '/retailer/BCER User Guide (2023).pdf';

      return (
        <ListItem disablePadding className={classes.listItem}>
          <ListItemButton
            component="a"
            href={filePath}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
              event.preventDefault();
              setAppGlobal((prevState: any) => ({
                ...prevState,
                userGuideComplete: true
              }));
              window.open(filePath, '_blank', 'noopener,noreferrer');
            }}
          >
            <ListItemIcon>
              {completedStep ? (
                <CheckCircleOutlineOutlined className={classes.listIcon} />
              ) : (
                <FiberManualRecordOutlined className={classes.listIcon} />
              )}
            </ListItemIcon>
            <ListItemText
              primary={stepTitle}
              className={classes.listLabel}
            />
          </ListItemButton>
        </ListItem>
      );
    }

    return (
      <ListItem disablePadding className={classes.listItem}>
        <ListItemButton
          component="a"
          href={appGlobal?.myBusinessComplete ? href : '#'}
          disabled={!appGlobal?.myBusinessComplete}
          onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            event.preventDefault();
            if (appGlobal?.myBusinessComplete) {
              navigate(href);
            }
          }}
        >
          <ListItemIcon>
            {completedStep ? (
              <CheckCircleOutlineOutlined
                className={
                  !pathname.includes(pathName)
                    ? classes.listIcon
                    : `${classes.listIcon} ${classes.activeIcon}`
                }
              />
            ) : (
              <FiberManualRecordOutlined
                className={
                  !pathname.includes(pathName)
                    ? classes.listIcon
                    : `${classes.listIcon} ${classes.activeIcon}`
                }
              />
            )}
          </ListItemIcon>
          <ListItemText
            primary={stepTitle}
            className={
              !pathname.includes(pathName)
                ? classes.listLabel
                : `${classes.listLabel} ${classes.activeLabel}`
            }
          />
          {!completedStep && showWarningIcon && (
            <ListItemIcon className={classes.errorIcon}>
              <ErrorOutline color="error" />
            </ListItemIcon>
          )}
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Root className={classes.sideNav}>
      <List component="nav" className={classes.listGroup}>
        <NavItem formStep="myDashboard" />
        <NavItem formStep="myBusiness" />
        <NavItem formStep="noi" />
        <NavItem formStep="productReport" />
        <NavItem formStep="manufacturingReport" />
        <NavItem formStep="salesReports" />
        <NavItem formStep="userGuide" />
        {keycloak.authenticated && (
          <div className={classes.logoutContainer} onClick={logout}>
            <img src={userSignOutLogo} alt="Sign Out" className={classes.signOutIcon} />
            <span className={classes.signOutText}>Sign Out</span>
          </div>
        )}
      </List>
    </Root>
  );
}