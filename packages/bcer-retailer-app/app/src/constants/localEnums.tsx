export enum UserType {
  'BO',
  'MoH',
  'HA',
}

export enum HealthAuthority {
  FRASER = 'fraser',
  INTERIOR = 'interior',
  ISLAND = 'island',
  NORTHERN = 'northern',
  COASTAL = 'coastal',
}

export enum HealthAuthorities {
  'fraser' = 'Fraser',
  'interior' = 'Interior',
  'island' = 'Island',
  'northern' = 'Northern',
  'coastal' = 'Coastal',
}

export enum BusinessLocationHeaders {
  'Address' = 'Business Address',
  'Address 2' = 'Business Address 2',
  'Postal Code' = 'Postal Code',
  'City' = 'City',
  'Buiness Email' = 'Business Email Address',
  'Phone Number' = 'Business Phone Number',
  'Underage Permitted' = 'Do you allow underage persons on premises?',
  'Health Authority' = 'Retail location health authority region',
  'Doing Business As' = 'The name this location is doing business as',
  'Manufacturing' = 'Do you manufacture E-substances on premises?',
}

export enum BusinessLocationDTOHeaders {
  addressLine1 = 'Address',
  addressLine2 = 'Address 2',
  postal = 'Postal Code',
  city = 'City',
  email = 'Buiness Email',
  phone = 'Phone Number',
  underage = 'Underage Permitted',
  health_authority = 'Health Authority',
  doingBusinessAs = 'Doing Business As',
  manufacturing = 'Manufacturing',
}

export enum ProductReportHeaders {
  'Type' = 'Type of Product',
  'Brand Name' = 'Brand Name',
  'Product Name' = 'Product Name',
  'Manufacturer Name' = "Manufacturer's Name",
  'Manufacturer Contact' = 'Manufacturer Contact',
  'Manufacturer Address' = "Manufacturer's Address",
  'Manufacturer Phone' = "Manufacturer's Phone",
  'Manufacturer Email' = "Manufacturer's Email",
  'Concentration (mg/mL)' = 'The concentration of non-therapeutic nicotine expressed in mg/mL',
  'Container Capacity' = 'The container that holds the restricted e-substance',
  'Cartridge Capacity' = 'The cartridge that holds or is packaged with the restricted e-substance',
  'Ingredients' = 'Ingredients',
  'Flavour' = 'Flavour',
}

export enum ProductReportDTOHeaders {
  type = 'Type',
  brandName = 'Brand Name',
  productName = 'Product Name',
  manufacturerName = 'Manufacturer Name',
  manufacturerContact = 'Manufacturer Contact',
  manufacturerAddress = 'Manufacturer Address',
  manufacturerPhone = 'Manufacturer Phone',
  manufacturerEmail = 'Manufacturer Email',
  concentration = 'Concentration (mg/mL)',
  containerCapacity = 'Container Capacity',
  cartridgeCapacity = 'Cartridge Capacity',
  ingredients = 'Ingredients',
  flavour = 'Flavour',
}

export enum ManufacturingReportHeaders {
  'Ingredient Name' = 'Ingredient Name',
  'Scientific Name' = 'Scientific Name',
  'Manufacturer Name' = 'Manufacturer Name',
  'Manufacturer Address' = 'Manufacturer Address',
  'Manufacturer Email' = 'Manufacturer Email',
  'Manufacturer Phone' = 'Manufacturer Phone',
}

export enum SalesReportHeaders {
  'Brand Name' = 'Brand Name',
  'Product Name' = 'Product Name',
  'Type' = 'Type',
  'Flavour' = 'Flavour',
  'Volume' = 'Volume',
  'Number of Containers Sold' = 'Number of Containers Sold',
  'Number of Cartridges Sold' = 'Number of Cartridges Sold',
}

export enum SalesReportCSVHeaders {
  'Brand Name' = 'Brand Name',
  'Product Name' = 'Product Name',
  'Concentration (mg/mL) (optional)' = 'Concentration (mg/mL) (optional)',
  'Container Capacity' = 'Container Capacity',
  'Cartridge Capacity' = 'Cartridge Capacity',
  'Flavour' = 'Flavour',
  'UPC (optional)' = 'UPC (optional)',
  'Number of Containers Sold' = 'Number of Containers Sold',
  'Number of Cartridges Sold' = 'Number of Cartridges Sold',
}

export enum SalesReportDTOHeaders {
  brandName = 'Brand Name',
  productName = 'Product Name',
  concentration = 'Concentration (mg/mL) (optional)',
  containerCapacity = 'Container Capacity',
  cartridgeCapacity = 'Cartridge Capacity',
  flavour = 'Flavour',
  upc = 'UPC (optional)',
  containers = 'Number of Containers Sold',
  cartridges = 'Number of Cartridges Sold',
}

export enum SubmissionTypeEnum {
  sales = 'Sales Report',
  product = 'Product Report',
  manufacturing = 'Manufacturing Report',
  noi = 'Notice of Intent',
  location = 'Location',
}

export enum SuccessStepEnum {
  noi = 'noi',
  product = 'product',
  manufacturing = 'manufacturing',
  sale = 'sale',
}

export enum NoiStatus {
  Submitted = 'submitted',
  NotRenewed = 'not_renewed' 
}

export enum NoiStatusHeaders {
  Submitted = 'Submitted',
  NotSubmitted = 'Not Submitted',
  NotRenewed = 'Not Renewed',
  NotRequired = 'Not Required',
}

export enum LocationStatus {
  Active = 'active',
  Closed = 'closed',
  Deleted = 'deleted',
}
