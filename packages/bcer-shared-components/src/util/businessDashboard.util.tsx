import { HealthAuthorities, LocationTypeLabels, ReportStatus } from "@/constants/enums/genericEnums";
import { LocationReportStatus, LocationRO } from "@/constants/interfaces/genericInterfaces";
import { Tooltip } from "@mui/material";
import Icon from '@mui/material/Icon';
import moment from "moment";
import React from 'react';

export class BusinessDashboardUtil {
  static getColumns (addressLine1: Function){
    return [
    {title: 'Type of Location', render: (l: LocationRO) => LocationTypeLabels[l.location_type]},
    {title: 'Location/URL', render: (l: LocationRO) => addressLine1(l)},
    {title: 'Doing Business As', render: (l: LocationRO) => l.doingBusinessAs || ''},
    {title: 'Health Authority', render: (l: LocationRO) => l.health_authority && HealthAuthorities[l.health_authority] 
                                                            || l.health_authority_other 
                                                            || ''},
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
    let tooltip = 'Submitted'
    let shape = "star_rate"
    if(r === ReportStatus.Missing){
      color = '#FF534A' //red
      tooltip = 'Not Submitted'
      shape = 'square'
    } else if(r === ReportStatus.NotRequired){
      color = '#aaa' //light grey
      tooltip = 'Not Required'
      shape = "circle"
    } else if(r === ReportStatus.PendingReview) {
      color = '#F69C12' //orange
      tooltip = 'Needs to be renewed'
      shape = "pentagon"
    }
    return (
      <Tooltip title={tooltip} placement="right">
        <Icon style={{color: color, lineHeight: 1.2, fontSize: '1.1rem'}}>{shape}</Icon>
      </Tooltip>
    )
  }

  static renderCreationDate(l: LocationRO){
    const date = l.created_at ? moment(l.created_at).utc(true).format("MMM DD, YYYY") : "";
    const time = l.created_at ? moment(l.created_at).utc(true).format("hh:mm:ss a") : "";
    return (
      `${date} at ${time}`
    )
  }
  
  static getLocationColumn() {
    return ([
      {title: 'NOI', render: (r:LocationReportStatus) => this.renderStatus(r.noi)},
      {title: 'Product Report', render: (r:LocationReportStatus) => this.renderStatus(r.productReport)},
      {title: 'Manufacturing Report', render: (r:LocationReportStatus) => this.renderStatus(r.manufacturingReport)},
      {title: 'Sales Report', render: (r:LocationReportStatus) => this.renderStatus(r.salesReport)},
    ])
  }
}