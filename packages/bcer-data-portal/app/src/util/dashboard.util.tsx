import { BusinessRO } from "@/constants/localInterfaces";
import { Link } from "react-router-dom";
import React from 'react';
import { routes } from "@/constants/routes";

export class DashboardUtil {
  static tableColumn = [
    { 
      title: 'Business Name', 
      render: (b: BusinessRO) => <Link to={`${routes.viewBusiness}/${b.id}`}>{b.businessName}</Link>,
      field: 'businessName',
      sortTitle: "Business Name",
    },
    { 
      title: 'Address', 
      field: 'addressLine1', 
      sortTitle: "Address" 
    },
    { 
      title: 'City', 
      field: 'city', 
      sortTitle: "City" 
    },
    { 
      title: 'Location with complete reports', 
      render: (b: BusinessRO) => b.reportingStatus?.completeReports?.length ?? 'N/A',
      sorting: false,
    },
    { 
      title: 'Location with outstanding reports', 
      render: (b: BusinessRO) => b.reportingStatus?.incompleteReports?.length ?? 'N/A',
      sorting: false,
    }
  ];
}