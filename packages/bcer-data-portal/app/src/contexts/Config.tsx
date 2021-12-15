import { useAxiosGet } from '@/hooks/axios';
import React, { useState, createContext, useEffect, Provider } from 'react';

export interface IConfigContext {
    config: {[key: string]: string}
}
  
export const ConfigContext = createContext<IConfigContext>({
    config: {}
});

export const ConfigProvider = ({ children }: {children: React.ReactNode})  => {
    const [{ data: config }, getConfig] =
        useAxiosGet<{[key: string]: string}>('/data/user/permissions');

    useEffect(() => {
        getConfig();
    }, []);

    return (
        <ConfigContext.Provider value={{config: config || {}}}>
          {children}
        </ConfigContext.Provider>
    );
};
