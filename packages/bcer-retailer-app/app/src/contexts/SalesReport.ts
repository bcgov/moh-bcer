import { createContext } from 'react';

export interface SalesReportContext {
  year: string;
  locationId: string;
  address: string;
}

const Context = createContext<[SalesReportContext, Function]>([{
  year: '',
  locationId: '',
  address: '',
}, () => {}]);

export const SalesReportContext = Context;
export const SalesReportProvider = Context.Provider;
export const SalesReportConsumer = Context.Consumer;
