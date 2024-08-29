import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { StyledButton } from "vaping-regulation-shared-components";
import store from 'store';
import { routes } from "@/constants/routes";

const ButtonWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

interface LogoutProps {
  variant: "dialog-accept" | "dialog-cancel"
}

const Logout = ({ variant }: LogoutProps) => {
  const navigate = useNavigate();
  const { keycloak } = useKeycloak();
    
  const logout = () => {
    store.clearAll();
    keycloak.logout();
    navigate(routes.root);
  }

  return (
    <ButtonWrapper>
      <StyledButton variant={variant} onClick={logout}>
        Log Out
      </StyledButton>
    </ButtonWrapper>
  )
}

export default Logout;