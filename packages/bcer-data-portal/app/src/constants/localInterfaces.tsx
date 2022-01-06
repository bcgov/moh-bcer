import { UserType, HealthAuthority } from '@/constants/localEnums';

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
  id?: string;
  addressLine1: string;
  addressLine2: string;
  postal: string;
  city: string;
  phone: string;
  email: string;
  underage: string;
  health_authority: HealthAuthority;
  manufacturing: string;
  manufactures: Array<ManufacturingReport>
  noi?: {
    created_at: Date;
  },
  business?: {
    businessName: string;
    legalName: string;
  }
  tableData?: {
    id: number;
    checked: boolean;
  }
  products?: Array<Products>;
  created_at?: Date;
  latitude?: string;
  longitude?: string;
  geoAddressConfidence?: string;
  geoAddress?: string;
  geoAddressId?: string;
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

export interface UserDetails extends UserProfile {
  firstName: string;
  lastName: string;
  business: Business;
}

export interface UserSearchFields {
  search: string;
  type: string;
}

export interface UserUpdateFields {
  active: boolean;
  selectedBusiness: Business;
  confirmed: boolean;
  mergeData: boolean;
  user: UserDetails;
}

export interface DragAndDropItem {
  id: string;
  [s: string]: unknown;
}

export interface RouteOptions {
  option: 'fastest' | 'shortest';
  roundTrip: boolean;
  optimizeOrder: boolean;
  ferrySchedule: boolean;
  timeDependent: boolean;
  traffic: boolean;
  turnRestriction: boolean;
  events: boolean;
  crossingCost: boolean;
  globalDistortionField: boolean;
  turnCost: boolean;
  localDistortionField: boolean;
}

export interface DirectionNotification {
  type: string;
  message: string;
}

export interface DirectionEntity {
  type: string;
  name: string;
  distance: number;
  time: number;
  text: string;
  point: [number, number];
  notifications?: DirectionNotification[];
}

export type BCLngLatPoint = [number, number];

export interface BCDirectionData {
  routeDescription: string;
  searchTimestamp: string;
  executionTime: number;
  version: string;
  criteria: string;
  enable: string;
  distanceUnit: string;
  points: BCLngLatPoint[];
  routeFound: boolean;
  distance: number;
  time: number;
  timeText: string;
  route: BCLngLatPoint[];
  notifications: any[];
  directions: DirectionEntity[];
  visitOrder?: number[];
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

export interface LocationConfig {
  mapBoxAccessToken: string;
  mapBoxTileLayer: string;
  mapBoxAttribution: string;
  mapBoxId: string;
}