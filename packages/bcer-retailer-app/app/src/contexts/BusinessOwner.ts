import { createContext } from 'react';
import { Business } from '@/constants/localInterfaces';

const Context = createContext<Business[] | []>([]);

export const BusinessOwnerContextProvider = Context.Provider;
export const BusinessOwnerContextConsumer = Context.Consumer;
