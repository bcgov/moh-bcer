import { createContext } from 'react';

export interface Config {
  enableSubscription: boolean;
}

export interface AppGlobalContext {
  myBusinessComplete: boolean;
  noiComplete: boolean;
  productReportComplete: boolean;
  manufacturingReportComplete: boolean;
  networkErrorMessage: string;
  config: Config;
}

const Context = createContext<[AppGlobalContext, Function]>([{
  myBusinessComplete: false,
  noiComplete: false,
  productReportComplete: false,
  manufacturingReportComplete: false,
  networkErrorMessage: '',
  config: {
    enableSubscription: false,
  }
}, () => {}]);

export const AppGlobalContext = Context;
export const AppGlobalProvider = Context.Provider;
export const AppGlobalConsumer = Context.Consumer;
