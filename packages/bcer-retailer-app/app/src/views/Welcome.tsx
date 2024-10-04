import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { StyledButton } from 'vaping-regulation-shared-components';
import { useAxiosPost } from '@/hooks/axios';
import { styled } from '@mui/material/styles';
import { CircularProgress, Typography } from '@mui/material';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';

const SplashContainer = styled('div')({
  display: 'flex',
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center'
});

const SplashWrapper = styled('div')({
  maxWidth: '950px'
});

const ButtonWrapper = styled('div')({
  paddingTop: '30px',
  display: 'flex',
  justifyContent: 'flex-end'
});

export default function Welcome() {
  const navigate = useNavigate();
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const [hasCheckedProfile, setHasCheckedProfile] = useState(false);

  const [{ data: profile, loading, error }] = useAxiosPost('/users/profile');

  useEffect(() => {
    if (error) {
      setAppGlobal({ ...appGlobal, networkErrorMessage: formatError(error) });
    } else if (profile?.business?.legalName && !hasCheckedProfile) {
      setHasCheckedProfile(true);
      setAppGlobal({ ...appGlobal, myBusinessComplete: true });
      navigate('/myDashboard');
    }
  }, [error, profile, appGlobal, setAppGlobal, navigate, hasCheckedProfile]);

  if (loading) return <CircularProgress />;
  if (hasCheckedProfile) return null;

  return (
    <SplashContainer>
      <SplashWrapper>
        <Typography variant='h5'>Welcome to E-Substances Reporting Application</Typography>
        <Typography variant='body1'>
          As a first-time user of this application, you need to finish the initial setup of your organization. Next time you login, you will not have to complete this step.
        </Typography>
        <Typography variant='body1'>
          If you have already submitted a product and manufacturing report by email to <a href="mailto:vaping.info@gov.bc.ca">vaping.info@gov.bc.ca</a>, you will have to reupload this into the BCER.
        </Typography>
        <ButtonWrapper>
          <StyledButton variant='contained' onClick={() => navigate('/business/details')}>
            Start
          </StyledButton>
        </ButtonWrapper>
      </SplashWrapper>
    </SplashContainer>
  );
}