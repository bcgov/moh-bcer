import { createContext } from 'react';
import { BusinessLocation } from '@/constants/localInterfaces';

export interface ProductReportContext {
  submissionId: string;
  locations: BusinessLocation[];
  mapping: {
    brandName: string;
    cartridgeCapacity: string;
    concentration: string;
    containerCapacity: string;
    flavour: string;
    ingredients: string;
    manufacturerAddress: string;
    manufacturerEmail: string;
    manufacturerName: string;
    manufacturerContact: string;
    manufacturerPhone: string;
    productName: string;
    type: string;
  },
  products: any[];
  entry: string;
  fileData?: any;
}

const Context = createContext<[ProductReportContext, Function]>([{
  submissionId: '',
  locations: [],
  mapping: {
    brandName: '',
    cartridgeCapacity: '',
    concentration: '',
    containerCapacity: '',
    flavour: '',
    ingredients: '',
    manufacturerAddress: '',
    manufacturerEmail: '',
    manufacturerName: '',
    manufacturerContact: '',
    manufacturerPhone: '',
    productName: '',
    type: '',
  },
  products: [],
  entry: '',
  fileData: undefined
}, () => {}]);

export const ProductInfoContext = Context;
export const ProductInfoProvider = Context.Provider;
export const ProductInfoConsumer = Context.Consumer;
