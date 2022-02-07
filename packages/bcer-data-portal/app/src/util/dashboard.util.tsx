import { BusinessRO } from "@/constants/localInterfaces";

export class DashboardUtil {
  static tableColumn = [
    { title: 'Business Name', field: 'businessName' },
    { title: 'Address', field: 'addressLine1' },
    { title: 'City', field: 'city' },
    { title: 'Location with complete reports', render: (b: BusinessRO) => b.reportingStatus?.completeReports?.length ?? 'N/A'},
    { title: 'Location with missing reports', render: (b: BusinessRO) => b.reportingStatus?.incompleteReports?.length ?? 'N/A'}
  ];
}
