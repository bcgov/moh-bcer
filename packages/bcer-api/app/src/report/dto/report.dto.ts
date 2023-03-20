export class ReportRequestDto {
    bcStatistics: BCRetailerStat[];
    haStatistics: HARetailerStat[];
}

export type BCRetailerStat = 
    "totalBusinesses"|"totalByStatus"|"totalWithOutstandingReports"|"totalWithOver19Customers"|"totalWithAllAgesCustomers"|"topFlavours";

export type HARetailerStat = 
    "totalByStatus"|"totalWithOutstandingReports"|"totalWithOver19Customers"|"totalWithAllAgesCustomers"|"topFlavours";

export class ReportResponseDto {
    bcStatistics: BCRetailerStatData;
    haStatistics: HARetailerStatData;
}

export class BCRetailerStatData {
    total?: number;
    totalByStatus?:  RetailerStatus;
    totalWithOutstandingReports?: MissingReport;
    totalWithOver19Customers?: number;
    totalWithAllAgesCustomers?: number;
    topFlavours?: FlavourCount[]
};

export class HARetailerStatData {
    totalByStatus?:  {
        coastal: RetailerStatus,
        fraser: RetailerStatus,
        interior: RetailerStatus,
        island: RetailerStatus,
        northern: RetailerStatus,
        other: RetailerStatus,
    };
    totalWithOutstandingReports?: {
        coastal: MissingReport,
        fraser: MissingReport,
        interior: MissingReport,
        island: MissingReport,
        northern: MissingReport,
        other: MissingReport,
    };
    totalWithOver19Customers?: {
        coastal: number,
        fraser: number,
        interior: number,
        island: number,
        northern: number,
        other: number,
    };
    totalWithAllAgesCustomers?: {
        coastal: number,
        fraser: number,
        interior: number,
        island: number,
        northern: number,
        other: number,
    };
    topFlavours?: {
        coastal: FlavourCount[],
        fraser: FlavourCount[],
        interior: FlavourCount[],
        island: FlavourCount[],
        northern: FlavourCount[],
        other: FlavourCount[],
    }
}

export class RetailerStatus {
    active: number;
    closed: number;
}

export class MissingReport {
    noiNotRenewed: number;
    missingNoi: number;
    missingSalesReport: number;
    missingManufacturingReport: number;
    noProductSubmitted: number;
}

export class FlavourCount {
    [key: string]: number
}