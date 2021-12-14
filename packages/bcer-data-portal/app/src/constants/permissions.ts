import Keycloak from "keycloak-js";

const parsePermissions = (permissions: {[key: string]: string}): {[key: string]: string[]} => {
    return Object.entries(permissions).reduce((acc: {[key: string]: string[]}, [key, value]) => {
        acc[key] = value?.split(',') || [];

        return acc;
    }, {})

}

export const PERMISSIONS = {
    MANAGE_LOCATIONS: 'MANAGE_LOCATIONS',
    MANAGE_USERS: 'MANAGE_USERS',
    SEND_TEXT_MESSAGES: 'SEND_TEXT_MESSAGES',
}

const ROLE_PERMISSIONS = parsePermissions({
    [PERMISSIONS.MANAGE_LOCATIONS]: process.env.MANAGE_LOCATION_ROLES,
    [PERMISSIONS.MANAGE_USERS]: process.env.MANAGE_USER_ROLES,
    [PERMISSIONS.SEND_TEXT_MESSAGES]: process.env.SEND_TEXT_MESSAGE_ROLES,
});

export const hasPermission = (keycloakInstance: Keycloak.KeycloakInstance, permission: string): boolean => {
    const roles = keycloakInstance.tokenParsed?.resource_access[process.env.KEYCLOAK_CLIENTID]?.roles || [];

    console.log(keycloakInstance.tokenParsed.resource_access)
    console.log(ROLE_PERMISSIONS, process.env.KEYCLOAK_CLIENTID)

    return roles.some(role => ROLE_PERMISSIONS[role]?.includes(permission))
}