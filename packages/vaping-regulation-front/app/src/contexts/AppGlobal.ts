import { createContext } from 'react';

export interface AppGlobalContext {
  myBusinessComplete: boolean;
  noiComplete: boolean;
  productReportComplete: boolean;
  manufacturingReportComplete: boolean;
  networkErrorMessage: string;
}

const Context = createContext<[AppGlobalContext, Function]>([{
  myBusinessComplete: false,
  noiComplete: false,
  productReportComplete: false,
  manufacturingReportComplete: false,
  networkErrorMessage: ''
}, () => {}]);

export const AppGlobalContext = Context;
export const AppGlobalProvider = Context.Provider;
export const AppGlobalConsumer = Context.Consumer;
