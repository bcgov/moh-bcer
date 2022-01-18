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

export type LocationRO = {
  id: string;
  email: string;
  webpage: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postal: string;
  phone: string;
  underage: string;
  ha: string;
  ha_other: string;
  doingBusinessAs: string;
  manufacturing: boolean;
  created_at: string;
  updated_at: string;
  deletedAt: string;
  businessId: string;
  status: string;
  closedAt: string;
  closedTime: string;
  geoAddress: string;
  geoAddressId: string;
  longitude: string;
  latitude: string;
  geoAddressConfidence: string;
  business: BusinessRO;
  noi: NoiRO;
  sales: Array<SalesRO>;
  products: Array<ProductsRO>;
  manufactures: Array<ManufacturesRO>;
}

export type BusinessRO = {
    id: string;
    legalName: string;
    businessName: string;
    email: string;
    webpage: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    postal: string;
    phone: string;
    notificationPreferences: string;
    created_at: string;
    updated_at: string;
    users: Array<UserRO>
}

export type UserRO = {
  id: string;
  user_status_id: string;
  type: string;
  firstName: string;
  lastName: string;
  email: string;
  bceid: string;
  bceidUser: string;
  lastLogin: string;
  created_at: string;
  updated_at: string;
  businessId: string;
}

export type NoiRO = {
  id: string;
  created_at: string;
  updated_at: string;
  renewed_at: string;
}

//TODO
export type SalesRO = {}

export type ProductsRO = {
  id: string;
  type: string;
  brandName: string;
  productName: string;
  manufacturerName: string;
  manufacturerAddress: string;
  manufacturerPhone: string;
  manufacturerEmail: string;
  manufacturerContact: string;
  concentration: string;
  containerCapacity: string;
  cartridgeCapacity: string;
  ingredients: string;
  flavour: string;
  productUploadId: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export type ManufacturesRO = {
  id: string;
  productName: string;
  created_at: string;
  updated_at: string;
  ingredients: Array<IngredientsRO>;
}

export type IngredientsRO = {
  id: string;
  name: string;
  scientificName: string;
  manufacturerName: string;
  manufacturerAddress: string;
  manufacturerPhone: string;
  manufacturerEmail: string;
}