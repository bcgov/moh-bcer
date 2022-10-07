import {
  UserType,
  HealthAuthority,
  NoiStatus,
  LocationStatus,
  ReportStatus
} from '@/constants/localEnums';
import { LocationType } from 'vaping-regulation-shared-components';

export interface UserProfile {
  id: string;
  name: string;
  bcid: string;
  email: string;
  type: UserType;
}

export interface Business {
  id: string;
  address: string;
  email: string;
  type: string;
  legalName: string;
  businessName: string;
  city: string;
  postal: string;
  phone: string;
  underage: string;
  ha: string;
}

export interface KeycloakComponentProps {
  realm: string;
  url: string;
  clientId: string;
}

export interface BusinessDetails {
  legalName: string;
  businessName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postal: string;
  email: string;
  phone: string;
  webpage?: string;
}

export interface BusinessLocation {
  location_type: LocationType,
  id?: string;
  addressLine1: string;
  geoAddressConfidence: string;
  postal: string;
  city: string;
  phone: string;
  email: string;
  underage: string;
  underage_other: string;
  health_authority: HealthAuthority;
  doingBusinessAs: string;
  manufacturing: string;
  manufactures: Array<ManufacturingReport>;
  latitude: string;
  longitude: string;
  noi?: {
    created_at: Date;
    status: NoiStatus;
    renewed_at: Date;
    updated_at: Date;
    expiry_date: Date;
  };
  products?: Array<Products>;
  productsCount: number;
  manufacturesCount: number;
  sales?: Array<Sale>;
  salesCount: number;
  created_at?: Date;
  status: LocationStatus;
  reportStatus?: LocationReportStatus;
  webpage: string;
}

export interface LocationFileUploadRO {
  submissionId: string;
  headers: string[];
  locations?: Object[];
}

export interface ProductsFileUploadRO {
  submissionId: string;
  headers: string[];
  products?: Array<Products>;
}

export interface Products {
  brandName: string;
  cartridgeCapacity: string;
  concentration: string;
  containerCapacity: string;
  flavour: string;
  ingredients: string;
  manufacturerAddress: string;
  manufacturerContact: string;
  manufacturerEmail: string;
  manufacturerName: string;
  manufacturerPhone: string;
  productName: string;
  type: string;
  sales: Array<Sale>;
}

export interface ProductsSold {
  id: string;
  brandName: string;
  productName: string;
  concentration: string;
  containerCapacity: string;
  cartridgeCapacity: string;
  flavour: string;
  upc: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ingredient {
  name: string;
  scientificName: string;
  manufacturerName: string;
  manufacturerAddress: string;
  manufacturerPhone: string;
  manufacturerEmail: string;
}

export interface ManufacturingReport {
  id: string;
  ingredients: any[];
  locations: string[];
  productName: string;
  created_at: number | string;
}

export interface Sale {
  id: string;
  product: Products;
  cartridges: string;
  containers: string;
  year: string;
  productSold: ProductsSold;
}

export interface SalesReport {
  brandName: string;
  productName: string;
  concentration: string;
  containerCapacity: string;
  cartridgeCapacity: string;
  flavour: string;
  upc?: string;
  containers: string;
  cartridges: string;
}

export interface GenericTableProp {
  data: Array<any>;
  fullScreenProp?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  handleActionButton?: Function;
  handleSelection?: Function;
}

export type TableColumn = {
  title?: string;
  sorting?: boolean;
  defaultSort?: 'desc' | 'asc';
  width?: number;
} & ({ field: string } | { render: (data: any, type: "row" | "group") => any });

export interface SubscriptionFormData {
  phoneNumber1: string;
  phoneNumber2: string;
  confirmed: boolean;
}

export interface Subscription {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  phoneNumber1: string;
  phoneNumber2: string;
  confirmed: boolean;
  enableSubscription: boolean;
}

export type BCGeocoderAutocompleteData = {
  geometry: {
    type: string;
    coordinates: Array<number>;
    crs: {type: string; properties: {code: string;}};
  };
  properties: {
    accessNotes: string;
    blockID: string;
    changeDate: string;
    civicNumber: string;
    civicNumberSuffix: string;
    electoralArea: string;
    faults: Array<{element: string; fault: string; penalty: number; value: number;}>
    fullAddress: string;
    fullSiteDescriptor: string;
    isOfficial: string;
    isStreetDirectionPrefix: string;
    isStreetTypePrefix: string;
    localityName: string;
    localityType: string;
    locationDescriptor: string;
    locationPositionalAccuracy: string;
    matchPrecision: string;
    precisionPoints: string;
    provinceCode: string;
    score: string;
    siteID: string;
    siteName: string;
    siteRetireDate: string;
    siteStatus: string;
    streetDirection: string;
    streetName: string;
    streetQualifier: string;
    streetType: string;
    unitDesignator: string;
    unitNumber: string;
    unitNumberSuffix: string;
  };
  type: string;
}

export type BusinessReportStatus = {
  completeReports: string[];
  incompleteReports: string[];
  missingNoi: string[];
  missingProductReport: string[];
  missingSalesReport: string[];
  missingManufacturingReport: string[];
  earlyMissingConfirmed: boolean;
}

export interface LocationReportStatus {
  noi: ReportStatus;
  manufacturingReport: ReportStatus;
  productReport: ReportStatus;
  salesReport: ReportStatus;
}