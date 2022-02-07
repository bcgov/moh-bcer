import { ForbiddenException, NotImplementedException } from "@nestjs/common";
import { BusinessReportingStatusRO } from "src/business/ro/busunessReportingStatus.ro";
import { LocationEntity } from "../entities/location.entity";
import { LocationReportingStatusRO } from "../ro/locationReportingStatus.ro";
import { LocationReportingStatus } from "./locationReportStatus";

export class SingleLocationReportStatus extends LocationReportingStatus {
  protected result: LocationReportingStatusRO = new LocationReportingStatusRO();

  /**
   * 
   * @param l `LocationEntity` with productCount, salesCount and manufacturingCount available*
   */
  makeStatus(l: LocationEntity){
    this.result.noi = this.getNoiReportStatus(l);
    this.result.manufacturingReport = this.getManufacturingReportStatus(l);
    this.result.productReport = this.getProductsReportStatus(l);
    this.result.salesReport = this.getSalesReportStatus(l)
    return this;
  }

  // throwing if build is accessed from inherited class.
  build(): BusinessReportingStatusRO {
    throw new ForbiddenException();
  }

  // throwing if check is accessed from inherited class.
  check(): this {
      throw new ForbiddenException();
  }

  get(){
    return this.result;
  }
}