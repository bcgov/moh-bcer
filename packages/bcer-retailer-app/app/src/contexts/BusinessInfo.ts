import { createContext } from 'react';
import { BusinessDetails, BusinessLocation } from '@/constants/localInterfaces';

export interface BIContext {
  details: BusinessDetails;
  detailsComplete: boolean;
  locations: BusinessLocation[];
  mapping: {};
  submissionId: string;
  notifications: {};
  notificationsValid: boolean;
  entry: string;
  currentPage: number;
  fileData?: any;
}

const Context = createContext<[BIContext, Function]>([{
  details: {
    legalName: '',
    businessName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postal: '',
    email: '',
    phone: '',
    webpage: '',
  },
  detailsComplete: false,
  locations: [],
  mapping: {},
  submissionId: '',
  notifications: {},
  notificationsValid: false,
  entry: '',
  currentPage: 0,
  fileData: undefined
}, () => {}]);

export const BusinessInfoContext = Context;
export const BusinessInfoProvider = Context.Provider;
export const BusinessInfoConsumer = Context.Consumer;
