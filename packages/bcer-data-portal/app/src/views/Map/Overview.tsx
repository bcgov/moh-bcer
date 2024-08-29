import { useAxiosGet } from '@/hooks/axios';
import { styled } from '@mui/material/styles';
import { Box, LinearProgress, Typography } from '@mui/material';
import React from 'react';
import { StyledButton } from 'vaping-regulation-shared-components';
import Map from './Map';
import GetAppIcon from '@mui/icons-material/GetApp';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/constants/routes';
import { LocationConfig } from '@/constants/localInterfaces';

const PREFIX = 'Overview';

const classes = {
  loadingWrapper: `${PREFIX}-loadingWrapper`,
  contentWrapper: `${PREFIX}-contentWrapper`,
  content: `${PREFIX}-content`,
  helpTextWrapper: `${PREFIX}-helpTextWrapper`,
  helperIcon: `${PREFIX}-helperIcon`,
  buttonWrapper: `${PREFIX}-buttonWrapper`,
  actionsWrapper: `${PREFIX}-actionsWrapper`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.loadingWrapper}`]: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  [`& .${classes.contentWrapper}`]: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  },

  [`& .${classes.content}`]: {
    maxWidth: '1440px',
    width: '95%',
    padding: '20px 30px',
  },

  [`& .${classes.helpTextWrapper}`]: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#E0E8F0',
    marginBottom: '30px',
    borderRadius: '5px',
  },

  [`& .${classes.helperIcon}`]: {
    fontSize: '45px',
    color: '#0053A4',
    paddingRight: '25px',
  },

  [`& .${classes.buttonWrapper}`]: {
    display: 'flex',
    alignItems: 'center',
  },

  [`& .${classes.actionsWrapper}`]: {
    display: 'flex',
    justifyContent: 'space-between',
  }
}));

function Overview() {

  const {keycloak} = useKeycloak();
  const navigate = useNavigate();

  const logout = () => {
    store.clearAll();
    keycloak.logout();
    navigate(routes.root);
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
