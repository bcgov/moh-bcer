import Drawer from "@material-ui/core/Drawer/Drawer";
import IconButton from "@material-ui/core/IconButton/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MenuIcon from '@material-ui/icons/Menu';
import React, { useState } from "react";
import { Link } from "react-router-dom";
import AppMenu from "./AppMenu";
import Logout from "./Logout";

const useStyles = makeStyles((theme) => ({
  menuButtonWrap: {
    height: 40,
    backgroundColor: '#F2F0F3',
    '& button': {
        marginTop: -5,
        color: '#003466'
    }
  },
  drawer: {
    '& .MuiDrawer-paper': {
      marginTop: 64,
      backgroundColor: '#F2F0F3',
      width: '70%',
      paddingLeft:20,
      zIndex: 1000000,
    },
    '& button': {
      justifyContent: 'left',
      '& span.MuiTab-wrapper': {
        width: 'inherit'
      }
    }
  },
  drawerCloseButton: {
    justifyContent: 'left',
    color: '#003466'
  },
  getHelp: {
    color: '#003466',
    fontWeight: 'bolder'
  }
}))

const MobileNav = () => {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false); 
   
  return (
    <>
      {!openDrawer &&
      <div className={classes.menuButtonWrap}>
        <IconButton onClick={() => setOpenDrawer(!openDrawer)}><MenuIcon fontSize="large"/></IconButton>
      </div>}
            
      <Drawer anchor="left"  open={openDrawer} onClose={() => setOpenDrawer(false)} className={classes.drawer}> 
        <IconButton onClick={() => setOpenDrawer(false)} style={{justifyContent: 'left'}}><MenuIcon fontSize="large" style={{color: '#003466'}}/></IconButton>
        
        <AppMenu orientation = "vertical" />
        
        <List>
          <ListItem style={{paddingLeft: 12}}>
            Having Trouble? &nbsp;<Link className={classes.getHelp} to='/gethelp'>Get Help</Link>
          </ListItem>                
        </List>

        <br /><br /><br />
        <Logout variant='dialog-accept' />
      </Drawer>
    </>
    );
}

export default MobileNav;