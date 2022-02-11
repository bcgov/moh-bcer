export class BusinessReportingStatusRO {
  completeReports: string[];
  incompleteReports: string[];
  missingNoi: string[];
  missingProductReport: string[];
  missingSalesReport: string[];
  missingManufacturingReport: string[];
  earlyMissingConfirmed: boolean;
  
  constructor(){
    Object.assign(this, {
      completeReports: [],
      incompleteReports: [],
      missingNoi: [],
      missingProductReport: [],
      missingSalesReport: [],
      missingManufacturingReport: [],
      earlyMissingConfirmed: false,
    })
  }
}