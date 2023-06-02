export const healthAuthorityOptions = [
  { value: 'all', label: 'All' },
  { value: 'coastal', label: 'Coastal' },
  { value: 'fraser', label: 'Fraser' },
  { value: 'interior', label: 'Interior' },
  { value: 'island', label: 'Island' },
  { value: 'northern', label: 'Northern' },
];

export const businessSearchCategoryOptions = [
  { label: 'All', value: 'all'},
  { label: 'Business Name', value: 'businessName' },
  { label: 'Legal Name', value: 'legalName' },
  { label: 'Address', value: 'addressLine1' },
  { label: 'City', value: 'city' },
  { label: 'Postal Code', value: 'postal' },
]

export const reportRequestOptions = { 
  bcStatistics: [
      {value: "totalBusinesses", label: "Total Number of retailers"}, 
      {value: "totalByStatus", label: "Total number of Retailers by status"}, 
      {value: "totalWithOutstandingReports", label: "Total number of Outstanding reports"}, 
      {value: "totalWithOver19Customers", label: 'Total number with "Over 19" customers'}, 
      {value: "totalWithAllAgesCustomers", label: 'Total number with "All-ages" customers'}, 
      {value: "topFlavours", label: "Top Flavours"}
  ], 
  haStatistics: [
      {value: "totalByStatus", label: "Total number of Retailers by status"}, 
      {value: "totalWithOutstandingReports", label: "Total number of Outstanding reports"}, 
      {value: "totalWithOver19Customers", label: 'Total number with "Over 19" customers'}, 
      {value: "totalWithAllAgesCustomers", label: 'Total number with "All-ages" customers'}, 
      {value: "topFlavours", label: "Top Flavours"}
  ]
}