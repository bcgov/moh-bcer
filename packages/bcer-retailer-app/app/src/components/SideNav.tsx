import React, { useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import store from 'store';
import { useKeycloak } from '@react-keycloak/web';
import { useAxiosGet } from '@/hooks/axios';
import {
  CheckCircleOutlineOutlined,
  FiberManualRecordOutlined,
  ErrorOutline,
} from '@material-ui/icons';
import {
  makeStyles,
  List,
  ListItemProps,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';
import userSignOutLogo from '@/assets/images/sign-out.png';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';

const useStyles = makeStyles({
  sideNav: {
    position: 'relative',
    maxWidth: '360px',
    minWidth: '360px',
    width: '360px',
    borderWidth: '0px 1px 0px 1px',
    borderStyle: 'solid',
    borderColor: '#CDCED2'
  },
  listGroup: {
    maxWidth: '360px',
    height: '100%',
    width: '360px',
    position: 'fixed',
    paddingTop: '70px',

  },
  listItem: {
    padding: '0px',
    marginBottom: '0px',
    height: '70px',
  },
  listLabel: {
    flex: 'none',
    '& .MuiTypography-root': {
      whiteSpace: 'nowrap',
      fontSize: '20px',
      color: "rgba(51, 51, 51, 0.5)"
    }
  },
  activeLabel: {
    '& .MuiTypography-root': {
      color: '#424242',
      fontWeight: 600
    }
  },
  listIcon: {
    fontSize: '30px !important',
    padding: '0px 24px 0px 24px',
    marginBottom: '0px !important',
  },
  activeIcon: {
    color: '#002C71'
  },
  signOutIcon: {
    marginBottom: '0px !important',
    padding: '0px 26px 0px 26px',
  },
  signOutText: {
    fontSize: '20px',
    color: "rgba(51, 51, 51, 0.5)",
  },
  logoutContainer: {
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
  errorIcon: {
    minWidth: '0px',
    padding: '0px 10px 0px 10px'
  }
});

function ListItemLink(props: ListItemProps<'a', { button?: true }>) {
  const history = useHistory();
  const classes = useStyles();

  return (
    <ListItem button component="a" className={classes.listItem}
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        history.push(props.href);
      }} {...props} />
  )
}

interface IconProps { formStep: 'myDashboard' | 'myBusiness' | 'noi' | 'productReport' | 'manufacturingReport' | 'salesReports' };

export default function SideNav() {
  const { pathname } = useLocation();
  const classes = useStyles();
  const [keycloak] = useKeycloak();
  const history = useHistory();
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

  const NavItem: React.SFC<IconProps> = ({ formStep }) => {
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
    }
    return (
      <ListItemLink href={appGlobal?.myBusinessComplete ? href : '#'} disabled={!appGlobal?.myBusinessComplete}>
        <ListItemIcon>
          {completedStep ?
            <CheckCircleOutlineOutlined
              className={
              !pathname.includes(pathName)
                ? classes.listIcon
                : `${classes.listIcon} ${classes.activeIcon}`
          } />
          : <FiberManualRecordOutlined
              className={
              !pathname.includes(pathName)
                ? classes.listIcon
                : `${classes.listIcon} ${classes.activeIcon}`
              }
            />
          }
        </ListItemIcon>
        <ListItemText
          primary={stepTitle}
          className={
            !pathname.includes(pathName)
              ? classes.listLabel
              : `${classes.listLabel} ${classes.activeLabel}`
          }
        />
        {
          !completedStep && showWarningIcon 
            && 
          <ListItemIcon className={classes.errorIcon}>
            <ErrorOutline color='error' />
          </ListItemIcon>
        }
      </ListItemLink>
    )
  }

  return (
    <div className={classes.sideNav}>
      <List component='nav' className={classes.listGroup} >
        <NavItem formStep={'myDashboard'} />
        <NavItem formStep={'myBusiness'} />
        <NavItem formStep={'noi'} />
        <NavItem formStep={'productReport'} />
        <NavItem formStep={'manufacturingReport'} />
        <NavItem formStep={'salesReports'} />
        {
          keycloak.authenticated && (
            <div className={classes.logoutContainer} onClick={logout}>
              <img src={userSignOutLogo} className={classes.signOutIcon} />
              <span className={classes.signOutText}>Sign Out</span>
            </div>
          )
        }
      </List>
    </div>
  )
}
