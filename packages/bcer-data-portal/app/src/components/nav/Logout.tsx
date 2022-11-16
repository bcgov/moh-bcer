import { routes } from "@/constants/routes";
import { Box, makeStyles } from "@material-ui/core";
import { useKeycloak } from "@react-keycloak/web";
import React from "react";
import { useHistory } from "react-router";
import { StyledButton } from "vaping-regulation-shared-components";

const useStyles = makeStyles((theme) => ({    
    buttonWrapper: {
      display: 'flex',
      alignItems: 'center',
    },
  }));

interface LogoutProps {
    variant: "dialog-accept" | "dialog-cancel"
}

const Logout = ({ variant }: LogoutProps) => {
  const classes = useStyles();
  const history = useHistory();
  const [keycloak] = useKeycloak();
    
  const logout = () => {
    store.clearAll();
    keycloak.logout();
    history.push(routes.root);
  }

  return (
    <Box>
      <StyledButton variant={variant} className={classes.buttonWrapper} onClick={logout}>
        Log Out
      </StyledButton>
    </Box>
  )
}

export default Logout;