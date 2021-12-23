import { useAxiosGet } from '@/hooks/axios';
import { Box, LinearProgress, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { StyledButton } from 'vaping-regulation-shared-components';
import Map from './Map';
import GetAppIcon from '@material-ui/icons/GetApp';
import { useKeycloak } from '@react-keycloak/web';
import { useHistory } from 'react-router';
import { routes } from '@/constants/routes';
import { LocationConfig } from '@/constants/localInterfaces';

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
}));

function Overview() {
  const classes = useStyles();
  const [keycloak] = useKeycloak();
  const history = useHistory();

  const logout = () => {
    store.clearAll();
    keycloak.logout();
    history.push(routes.root);
  };
  const [{ data: config, error, loading }, getData] = useAxiosGet<LocationConfig>(
    '/data/location/config'
  );

  return (
    <>
      {loading && <LinearProgress />}
      {config && !error && <Map config={config} />}
      {error && (
        <>
          <Box className={classes.helpTextWrapper}>
            <GetAppIcon className={classes.helperIcon} />
            <Typography variant="body1">
              You do not have the correct role to view this page.
            </Typography>
          </Box>
          <Box className={classes.buttonWrapper}>
            <StyledButton variant="outlined" onClick={logout}>
              Log Out
            </StyledButton>
          </Box>
        </>
      )}
    </>
  );
}

export default Overview;
