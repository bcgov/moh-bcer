export class ReportRequestDto {
    bcStatistics: BCRetailerStat[];
    haStatistics: HARetailerStat[];
}

export type BCRetailerStat = 
    "totalBusinesses"|"totalByStatus"|"totalWithOutstandingReports"|"totalWithOver19Customers"|"totalWithAllAgesCustomers"|"topFlavours";

export type HARetailerStat = 
    "totalByStatus"|"totalWithOutstandingReports"|"totalWithOver19Customers"|"totalWithAllAgesCustomers"|"topFlavours";