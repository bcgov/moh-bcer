import { LocationEntity } from '../entities/location.entity';
import { ReportBaseClass } from './reportBaseClass';
import { SingleLocationReportStatus } from './singleLocationReportStatus';

export class LocationReportingStatus extends ReportBaseClass {
  constructor(locations: LocationEntity[], exitEarly: boolean){
    super(locations, new SingleLocationReportStatus(), exitEarly);
  }
}
