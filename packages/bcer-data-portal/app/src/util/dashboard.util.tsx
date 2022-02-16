import { BusinessRO } from "@/constants/localInterfaces";
import { Link } from "react-router-dom";
import React from 'react';
import { routes } from "@/constants/routes";

export class DashboardUtil {
  static tableColumn = [
    { title: 'Business Name', render: (b: BusinessRO) => <Link to={`${routes.viewBusiness}/${b.id}`}>{b.businessName}</Link> },
    { title: 'Address', field: 'addressLine1' },
    { title: 'City', field: 'city' },
    { title: 'With complete reports', render: (b: BusinessRO) => b.reportingStatus?.completeReports?.length ?? 'N/A'},
    { title: 'With outstanding reports', render: (b: BusinessRO) => b.reportingStatus?.incompleteReports?.length ?? 'N/A'}
  ];
}
