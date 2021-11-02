import { UserType, HealthAuthority, NoiStatus, LocationStatus } from '@/constants/localEnums';

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
  doingBusinessAs: string;
  manufacturing: string;
  manufactures: Array<ManufacturingReport>;
  noi?: {
    created_at: Date;
    status: NoiStatus;
    renewed_at: Date;
    updated_at: Date;
  };
  products?: Array<Products>;
  productsCount: number;
  manufacturesCount: number;
  sales?: Array<Sale>;
  salesCount: number;
  created_at?: Date;
  status: LocationStatus;
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
  fullScreenProp?: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  handleActionButton?: Function;
  handleSelection?: Function;
}