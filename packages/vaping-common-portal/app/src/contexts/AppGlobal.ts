import { createContext } from 'react';

export interface AppGlobalContext {
  networkErrorMessage: string;
}

const Context = createContext<[AppGlobalContext, Function]>([{
  networkErrorMessage: ''
}, () => {}]);

export const AppGlobalContext = Context;
export const AppGlobalProvider = Context.Provider;
export const AppGlobalConsumer = Context.Consumer;
