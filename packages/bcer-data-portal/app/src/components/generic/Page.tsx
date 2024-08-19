import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import GetAppIcon from '@mui/icons-material/GetApp';
import { StyledButton } from 'vaping-regulation-shared-components';
import store from 'store';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/constants/routes';

const ContentWrapper = styled(Box)({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
});

const Content = styled(Box)({
  maxWidth: '1440px',
  width: '95%',
  padding: '20px 30px',
});

const HelpTextWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: '#E0E8F0',
  marginBottom: '30px',
  borderRadius: '5px',
});

const HelperIcon = styled(GetAppIcon)({
  fontSize: '45px',
  color: '#0053A4',
  paddingRight: '25px',
});

const ButtonWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

const ActionsWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
});

const Title = styled(Typography)({
  padding: '10px 0px',
  color: '#002C71',
});

const SubTitle = styled(Typography)({
  marginTop: '-10px',
  color: '#333333',
  fontSize: '14px',
  fontWeight: 500,
  marginBottom: '20px',
});

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
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const logout = () => {
    store.clearAll();
    keycloak.logout();
    navigate(routes.root);
  };

  return (
    <ContentWrapper>
      <Content>
        {error && (
          <>
            <HelpTextWrapper>
              <HelperIcon />
              <Typography variant="body1">
                You do not have the correct role to view this page. 
                <br />
                Please contact your Health Authority account administrator to request access.
              </Typography>
            </HelpTextWrapper>
            <ButtonWrapper>
              <StyledButton variant="outlined" onClick={logout}>
                Log Out
              </StyledButton>
            </ButtonWrapper>
          </>
        )}
        {!error && (
          <Box>
            {(title || showLogout) && (
              <ActionsWrapper>
                <Title variant="h5">
                  {title}
                </Title>
                {showLogout && (
                  <ButtonWrapper>
                    <StyledButton variant="outlined" onClick={logout}>
                      Log Out
                    </StyledButton>
                  </ButtonWrapper>
                )}
              </ActionsWrapper>
            )}

            <SubTitle>{subtitle}</SubTitle>

            {children}
          </Box>
        )}
      </Content>
    </ContentWrapper>
  );
}

export default Page;