import React, { useContext, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { StyledButton } from 'vaping-regulation-shared-components';
import { useAxiosPost } from '@/hooks/axios';
import { CircularProgress, Typography } from '@mui/material';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';

const PREFIX = 'Welcome';

const classes = {
  splashContainer: `${PREFIX}-splashContainer`,
  splashWrapper: `${PREFIX}-splashWrapper`,
  buttonWrapper: `${PREFIX}-buttonWrapper`
};

const Root = styled('div')({
  [`&.${classes.splashContainer}`]: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  [`& .${classes.splashWrapper}`]: {
    maxWidth: '950px'
  },
  [`& .${classes.buttonWrapper}`]: {
    paddingTop: '30px',
    display: 'flex',
    justifyContent: 'flex-end'
  }
});

export default function Welcome() {

  const navigate = useNavigate();
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext)
  const [{ data: profile, loading, error }] = useAxiosPost('/users/profile');
  const businessInformation = profile?.business?.legalName;

  useEffect(() => {
    if (error) {
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(error)})
    }
  }, [error])

  if (loading) {
    return <CircularProgress />;
  }

  if (businessInformation) {
    navigate('/myDashboard');
    return null; // or any other fallback if needed
  }

  return (
    <Root className={classes.splashContainer}>
      <div className={classes.splashWrapper}>
        <Typography variant='h5'>Welcome to E-Substances Reporting Application</Typography>
        <Typography variant='body1'>As a first-time user of this application, you need to finish the initial setup of your organization. Next time you login, you will not have to complete this step.</Typography>
        <Typography variant='body1'>If you have already submitted a product and manufacturing report by email to <a href="mailto:vaping.info@gov.bc.ca">vaping.info@gov.bc.ca</a>, you will have to reupload this into the BCER.</Typography>
        <div className={classes.buttonWrapper}> 
          <StyledButton variant='contained' onClick={() => navigate('/business/details')}>
            Start
          </StyledButton>
        </div>
      </div>
    </Root>
  );
}
