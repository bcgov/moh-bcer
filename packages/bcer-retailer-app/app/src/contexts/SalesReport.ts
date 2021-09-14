import { SalesReport } from '@/constants/localInterfaces';
import { createContext } from 'react';

export interface SalesReportContext {
  submissionId: string;
  saleReports: SalesReport[];
  mapping: SalesReport;
  year: string;
  locationId: string;
  address: string;
  doingBusinessAs: string;
  fileData?: any;
  isConfirmOpen?: boolean;
  isSubmitted: boolean;
}

const Context = createContext<[SalesReportContext, Function]>([
  {
    submissionId: '',
    saleReports: [],
    mapping: {
      brandName: '',
      productName: '',
      concentration: '',
      containerCapacity: '',
      cartridgeCapacity: '',
      flavour: '',
      containers: '',
      cartridges: '',
    },
    year: '',
    locationId: '',
    address: '',
    doingBusinessAs: '',
    fileData: undefined,
    isConfirmOpen: false,
    isSubmitted: false,
  },
  () => {},
]);
Context.displayName = 'SalesReportContext';

export const SalesReportContext = Context;
export const SalesReportProvider = Context.Provider;
export const SalesReportConsumer = Context.Consumer;
