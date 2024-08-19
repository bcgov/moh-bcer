import React, { useState } from "react";
import { Drawer, IconButton, List, ListItem } from "@mui/material";
import { styled } from "@mui/system";
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from "react-router-dom";
import AppMenu from "./AppMenu";
import Logout from "./Logout";

const MenuButtonWrap = styled('div')({
  height: 40,
  backgroundColor: '#F2F0F3',
  '& button': {
    marginTop: -5,
    color: '#003466'
  }
});

const StyledDrawer = styled(Drawer)({
  '& .MuiDrawer-paper': {
    marginTop: 64,
    backgroundColor: '#F2F0F3',
    width: '70%',
    paddingLeft: 20,
    zIndex: 1000000,
  },
  '& button': {
    justifyContent: 'left',
    '& span.MuiTab-wrapper': {
      width: 'inherit'
    }
  }
});

const DrawerCloseButton = styled(IconButton)({
  justifyContent: 'left',
  color: '#003466'
});

const GetHelpLink = styled(Link)({
  color: '#003466',
  fontWeight: 'bolder'
});

const MobileNav = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
   
  return (
    <>
      {!openDrawer &&
      <MenuButtonWrap>
        <IconButton onClick={() => setOpenDrawer(!openDrawer)}><MenuIcon fontSize="large"/></IconButton>
      </MenuButtonWrap>}
            
      <StyledDrawer anchor="left" open={openDrawer} onClose={() => setOpenDrawer(false)}> 
        <DrawerCloseButton onClick={() => setOpenDrawer(false)}>
          <MenuIcon fontSize="large" />
        </DrawerCloseButton>
        
        <AppMenu orientation="vertical" />
        
        <List>
          <ListItem sx={{paddingLeft: 1.5}}>
            Having Trouble? &nbsp;<GetHelpLink to='/gethelp'>Get Help</GetHelpLink>
          </ListItem>                
        </List>

        <br /><br /><br />
        <Logout variant='dialog-accept' />
      </StyledDrawer>
    </>
  );
}

export default MobileNav;