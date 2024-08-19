import React from 'react';
import { AppBar, Box } from '@mui/material';
import { styled } from '@mui/system';
import AppMenu from './AppMenu';
import Logout from './Logout';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#F1F1F1',
  boxShadow: 'none',
  width: '100%',
  padding: '10px 30px',
});

const StyledBox = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
});

const StyledAppMenu = styled(AppMenu)({
  '& .MuiTabs-indicator': {
    backgroundColor: '#fff',
  },
});

function Navigator() {
  return (
    <div>
      <StyledAppBar position="static">
        <StyledBox>
          <Box display="flex">           
            <StyledAppMenu orientation="horizontal" />
          </Box>
          <Logout variant='dialog-cancel' />          
        </StyledBox>
      </StyledAppBar>
    </div>
  );
}

export default Navigator;