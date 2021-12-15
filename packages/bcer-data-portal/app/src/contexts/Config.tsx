import { useAxiosGet } from '@/hooks/axios';
import React, { useState, createContext, useEffect, Provider } from 'react';

interface Permissions {
    permissions: {[key: string]: boolean};
    featureFlags: {[key: string]: boolean};
}
export interface IConfigContext {
    config: Permissions;
}
  
export const ConfigContext = createContext<IConfigContext>({
    config: {
        permissions: {},
        featureFlags: {}
    }
});

export const ConfigProvider = ({ children }: {children: React.ReactNode})  => {
    const [{ data: config }, getConfig] =
        useAxiosGet<Permissions>('/data/user/permissions');

    useEffect(() => {
        getConfig();
    }, []);

    return (
        <ConfigContext.Provider value={{config: config || {permissions: {}, featureFlags: {}}}}>
          {children}
        </ConfigContext.Provider>
    );
};
