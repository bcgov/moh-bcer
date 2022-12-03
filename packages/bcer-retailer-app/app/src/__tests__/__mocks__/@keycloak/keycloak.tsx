import React from 'react';
import { KeycloakProvider } from "@react-keycloak/web";

export const createKeycloakStub = () => ({
  init: jest.fn().mockResolvedValue(true),
  keycloak: jest.fn(),
  login: jest.fn(), 
  logout: jest.fn(), 
  register: jest.fn(),  
  accountManagement: jest.fn(),
  createLoginUrl: jest.fn(),
  createLogoutUrl: jest.fn(),
  createRegisterUrl: jest.fn(),
  createAccountUrl: jest.fn(),
  isTokenExpired: jest.fn(),
  updateToken: jest.fn(),
  clearToken: jest.fn(),
  hasRealmRole: jest.fn(),
  hasResourceRole: jest.fn(),
  loadUserProfile: jest.fn(),
  loadUserInfo: jest.fn(),
  ...jest.fn()
});

interface MockedAuthProviderProps {
  children: React.ReactChild;
  mocks: { [key: string]: typeof jest.fn };
}

export const MockedAuthProvider = (props: MockedAuthProviderProps) => {
  const { children, mocks } = props;
  const defaultMocks = createKeycloakStub();
  const keycloak = { ...defaultMocks, ...mocks };

  return (
    <KeycloakProvider keycloak={keycloak}>
      {children}
    </KeycloakProvider>
  );
};