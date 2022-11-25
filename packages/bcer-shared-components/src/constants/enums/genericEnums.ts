export enum ReportStatus {
  Reported = 'reported',
  Missing = 'missing',
  NotRequired = 'notRequired',
  PendingReview = 'pendingReview'
}

export enum LocationType {
  physical = 'physical',
  online = 'online',
  both = 'both',
}

export enum LocationTypeLabels {
  'physical' = 'Physical',
  'online' = 'Online',
  'both' = 'Physical and Online',
}

export enum ProvinceLabels {
  'AB' = 'Alberta',
  'BC' = 'British Columbia',
  'MB' = 'Manitoba',
  'NB' = 'New Brunswick',
  'NL' = 'Newfoundland and Labrador',
  'NS' = 'Nova Scotia',
  'NT' = 'Northwest Territories',
  'NU' = 'Nunavut',
  'ON' = 'Ontario',
  'PE' = 'Prince Edward Island',
  'QC' = 'Quebec',
  'SK' = 'Saskatchewan',
  'YT' = 'Yukon',
}

export enum HealthAuthorities {
  'fraser' = 'Fraser',
  'interior' = 'Interior',
  'island' = 'Island',
  'northern' = 'Northern',
  'coastal' = 'Coastal',
}