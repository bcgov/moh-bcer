import { Box, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import GetAppIcon from '@material-ui/icons/GetApp';
import { StyledButton } from 'vaping-regulation-shared-components';
import store from 'store';
import { useKeycloak } from '@react-keycloak/web';
import { useHistory } from 'react-router';
import { routes } from '@/constants/routes';

const useStyles = makeStyles((theme) => ({
  loadingWrapper: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrapper: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  },
  content: {
    maxWidth: '1440px',
    width: '95%',
    padding: '20px 30px',
  },
  helpTextWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#E0E8F0',
    marginBottom: '30px',
    borderRadius: '5px',
  },
  helperIcon: {
    fontSize: '45px',
    color: '#0053A4',
    paddingRight: '25px',
  },
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  actionsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    padding: '10px 0px',
    color: '#002C71',
  },
  subTitle: {
    marginTop: '-10px',
    color: '#333333',
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: '20px',
  },
}));

interface PageProps {
  error?: any;
  title?: string;
  subtitle?: string;
  showLogout?: boolean;
  children?: React.ReactNode;
}

function Page({
  error,
  title,
  showLogout = false,
  subtitle,
  children,
}: PageProps) {
  const classes = useStyles();
  const [keycloak] = useKeycloak();
  const history = useHistory();

  const logout = () => {
    store.clearAll();
    keycloak.logout();
    history.push(routes.root);
  };

  return (
    <Box className={classes.contentWrapper}>
      <Box className={classes.content}>
        {error && (
          <>
            <Box className={classes.helpTextWrapper}>
              <GetAppIcon className={classes.helperIcon} />
              <Typography variant="body1">
                You do not have the correct role to view this page. 
                <br />
                Please contact your Health Authority account administrator to request access.
              </Typography>
            </Box>
            <Box className={classes.buttonWrapper}>
              <StyledButton variant="outlined" onClick={logout}>
                Log Out
              </StyledButton>
            </Box>
          </>
        )}
        {!error && (
          <Box>
            {(title || showLogout) && (
              <Box className={classes.actionsWrapper}>
                <Typography className={classes.title} variant="h5">
                  {title}
                </Typography>
                {showLogout && (
                  <Box className={classes.buttonWrapper}>
                    <StyledButton variant="outlined" onClick={logout}>
                      Log Out
                    </StyledButton>
                  </Box>
                )}
              </Box>
            )}

            <Typography className={classes.subTitle}>{subtitle}</Typography>

            <>{children}</>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Page;
