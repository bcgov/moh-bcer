import { ReportStatus } from "@/constants/enums/genericEnums";
import { LocationReportStatus, LocationRO } from "@/constants/interfaces/genericInterfaces";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import React from 'react';

export class BusinessDashBoardUtil {
  static getColumns (addressLine1: Function){
    return [
    {title: 'Location', render: (l: LocationRO) => addressLine1(l)},
    {title: 'NOI', render: (l:LocationRO) => this.render(l, 'noi')},
    {title: 'Product Report', render: (l:LocationRO) => this.render(l, 'productReport')},
    {title: 'Manufacturing Report', render: (l:LocationRO) => this.render(l, 'manufacturingReport')},
    {title: 'Sales Report', render: (l:LocationRO) => this.render(l, 'salesReport')},
  ]}

  static render(l: LocationRO, type: keyof LocationReportStatus){
    return this.renderStatus(l?.reportStatus ? l.reportStatus[type] : ReportStatus.Missing)
  }

  static renderStatus(r: ReportStatus){
    let color = '#16C92E' //green

    if(r === ReportStatus.Missing){
      color = '#FF534A' //red
    }else if(r === ReportStatus.NotRequired){
      color = '#aaa' //light grey
    }
    return (
      <FiberManualRecordIcon htmlColor={color} />
    )
  }
}