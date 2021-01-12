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
