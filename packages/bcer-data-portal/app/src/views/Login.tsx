import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Container, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

import Header from '@/components/Header';
import userLoginLogo from '@/assets/images/user-check-1.png';
import arrowRight from '@/assets/images/arrow-right.png';

const SplashContainer = styled(Container)({
  display: 'flex',
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
});

const SplashWrapper = styled(Container)(({ theme }) => ({
  maxWidth: '950px',
  [theme.breakpoints.down('xs')]: {
    '& h5': {
      fontSize: 24,
    },
  },
}));

const AuthButtonContainer = styled(Box)(({ theme }) => ({
  color: '#1E5DB1',
  display: 'block',
  textDecoration: 'none',
  height: '90px',
  width: '652px',
  marginBottom: '30px',
  marginTop: '30px',
  border: 'solid 1px #0053A4',
  borderRadius: '4px',
  fontSize: '20px',
  fontWeight: 600,
  letterSpacing: '0',
  float: 'left',
  lineHeight: '27px',
  '&:hover': {
    background: '#E5EDF5',
    cursor: 'pointer',
  },
  [theme.breakpoints.down('xs')]: {
    width: 340,
    height: 50,
    fontSize: 16,
    lineHeight: '22px',
  },
}));

const AuthButtonIcon = styled(Box)(({ theme }) => ({
  height: '50px',
  width: '50px',
  margin: '19px',
  border: 'solid 1px #0053A4',
  borderRadius: '4px',
  float: 'left',
  [theme.breakpoints.down('xs')]: {
    width: 32,
    height: 32,
    margin: 10,
  },
}));

const ButtonImage = styled('img')(({ theme }) => ({
  height: '24px',
  width: '24px',
  margin: '15px',
  [theme.breakpoints.down('xs')]: {
    width: 20,
    height: 20,
    margin: 7,
  },
}));

const ArrowRight = styled('img')({
  height: '24px',
  width: '24px',
});

const ButtonText = styled(Box)(({ theme }) => ({
  height: '20px',
  width: '300px',
  margin: '32px 0px 0px 0px',
  [theme.breakpoints.down('xs')]: {
    height: 10,
    margin: '18px 0px 0px 0px',
  },
}));

const AuthArrow = styled(Box)({
  height: '14px',
  width: '14px',
  margin: '-16px 23px 0px 0px',
  float: 'right',
});

const SplashVerbiage = styled(Typography)(({ theme }) => ({
  padding: '30px 0px 30px 0px',
  [theme.breakpoints.down('xs')]: {
    fontSize: 14,
  },
}));

const SplashVerbiageBold = styled('b')({
  color: '#0053A4',
});

const SplashVerbiageLastParagraph = styled(Typography)({
  paddingBottom: '30px',
});

const AuthContainer = styled(Box)(({ theme }) => ({
  borderTop: '1px solid gray',
  paddingTop: '20px',
  [theme.breakpoints.down('xs')]: {
    '& p.MuiTypography-body1': {
      fontSize: 14,
    },
  },
}));

const Login = () => {
  const { keycloak, initialized } = useKeycloak();

  return (
    <>
      <Header />
      <SplashContainer maxWidth="lg">
        <SplashWrapper maxWidth="md">
          <Typography variant="h5">BC E-Substances Regulation Data Portal</Typography>
          <SplashVerbiage variant="body1">
            The new <SplashVerbiageBold>E-Substances Regulation</SplashVerbiageBold> introduced requirements for all businesses who currently
            sell E-substances or intend to sell E-substances in British Columbia. This application provides access to all reports submitted through the
            BC Vaping Regulation application.
            <br />
            <br />
          </SplashVerbiage>
          {initialized ? (
            <>
              <AuthContainer>
                <Typography variant="body1">
                  This application utilizes IDIR or HA ID for authentication.
                  <br />
                </Typography>
                <AuthButtonContainer onClick={() => keycloak.login({ idpHint: 'idir', redirectUri: location.origin + '/portal/#/keycloak' })}>
                  <AuthButtonIcon>
                    <ButtonImage src={userLoginLogo} alt="Login" />
                  </AuthButtonIcon>
                  <ButtonText>Continue with IDIR</ButtonText>
                  <AuthArrow>
                    <ArrowRight src={arrowRight} alt="Login" />
                  </AuthArrow>
                </AuthButtonContainer>
              </AuthContainer>
              <AuthButtonContainer onClick={() => keycloak.login({ idpHint: 'phsa', redirectUri: location.origin + '/portal/#/keycloak' })}>
                <AuthButtonIcon>
                  <ButtonImage src={userLoginLogo} alt="Login" />
                </AuthButtonIcon>
                <ButtonText>Continue with HA ID</ButtonText>
                <AuthArrow>
                  <ArrowRight src={arrowRight} alt="Login" />
                </AuthArrow>
              </AuthButtonContainer>
            </>
          ) : (
            <span>Connecting to KeyCloak</span>
          )}
        </SplashWrapper>
      </SplashContainer>
    </>
  );
};
export default Login;
