import { createContext } from 'react';
import { UserProfile } from '@/constants/localInterfaces';

const Context = createContext<UserProfile | null>(null);

export const UserContextProvider = Context.Provider;
export const UserContextConsumer = Context.Consumer;
