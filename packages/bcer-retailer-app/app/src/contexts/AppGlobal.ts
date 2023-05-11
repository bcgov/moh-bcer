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
  userGuideComplete: boolean;
}

const Context = createContext<[AppGlobalContext, Function]>([{
  myBusinessComplete: false,
  noiComplete: false,
  productReportComplete: false,
  manufacturingReportComplete: false,
  networkErrorMessage: '',
  config: {
    enableSubscription: false,
  },
  userGuideComplete: false,
}, () => {}]);

export const AppGlobalContext = Context;
export const AppGlobalProvider = Context.Provider;
export const AppGlobalConsumer = Context.Consumer;
