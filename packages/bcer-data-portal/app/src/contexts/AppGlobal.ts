import { createContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';

export interface AppGlobalContext {
  networkErrorMessage: string;
  history?: Location;
}

const Context = createContext<[AppGlobalContext, Function]>([{
  networkErrorMessage: '',
  history: null,
}, () => {}]);

export const AppGlobalContext = Context;
export const AppGlobalProvider = Context.Provider;
export const AppGlobalConsumer = Context.Consumer;
