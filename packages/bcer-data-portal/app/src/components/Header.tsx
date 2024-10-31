import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Link } from 'react-router-dom';
import { Box, Grid, Hidden } from '@mui/material';
import { styled } from '@mui/system';

import logo from '@/assets/images/logo-banner.svg';

const HeaderBox = styled(Box)(({ theme }) => ({
  height: 70,
  width: '100%',
  display: 'flex',    
  padding: '20px 65px 20px 10px',
  color: '#fff',
  backgroundColor: '#036',
  borderBottom: '2px solid #fcba19',
  zIndex: 1500,
  position: 'fixed',
  boxSizing: 'border-box',
  maxWidth: '100vw',
  [theme.breakpoints.down('sm')]: {
    boxSizing: 'inherit',
    height: 20,
    zIndex: 99999999    
  }    
}));

const LogoWrap = styled(Grid)(({ theme }) => ({
  borderRight: '1px solid #F3B229',
  maxWidth: 209,
  height: 45,
  paddingTop: '4px !important',
  [theme.breakpoints.down('sm')]: {
    height: 40,
    maxWidth: 117,
    '& img': {
      width: 100
    }
  }
}));

const TitleWrap = styled(Grid)(({ theme }) => ({
  paddingLeft: '20px !important',
  paddingTop: '0px !important',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: '10px !important',
  }
}));

const TopTitle = styled('div')({
  fontSize: '10px',
  lineHeight: '10px',    
});

const BottomTitle = styled('div')(({ theme }) => ({
  fontSize: '27px',
  lineHeight: '32px',
  whiteSpace: 'nowrap',
  [theme.breakpoints.down('sm')]: {
    fontSize: 14
  }
}));

const Logo = styled('img')({
  height: '37px',
  width: '200px',
});

const HelpGrid = styled(Grid)({
  minWidth: '195px',
});

const GetHelp = styled(Link)({
  color: '#F3B229',
  fontWeight: 'bold',
});

export default function Header() {
  const { keycloak } = useKeycloak();

  return (
    <HeaderBox>
      <Grid container spacing={2}>
        <LogoWrap item xs={4} md={2}>
          <Logo src={logo} alt="BC Government Logo" />
        </LogoWrap>
        <TitleWrap item xs={7} md={9}>
          <TopTitle>
            E-Substances Regulation
          </TopTitle>
          <BottomTitle>
            BC E-Substances Regulation Data Portal
          </BottomTitle>
        </TitleWrap>
      </Grid>
      {keycloak.authenticated &&
        <Hidden smDown>
          <HelpGrid>
            Having Trouble? <GetHelp to='/gethelp'>Get Help</GetHelp>      
          </HelpGrid>
        </Hidden>
      }
    </HeaderBox>    
  );
}