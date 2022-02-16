import { LocationEntity } from '../entities/location.entity';
import { ReportBaseClass } from './reportBaseClass';
import { SingleLocationComplianceStatus } from './singleLocationComplianceStatus';

export class LocationComplianceStatus extends ReportBaseClass {
  constructor(locations: LocationEntity[], exitEarly?: boolean) {
    super(locations, new SingleLocationComplianceStatus(), exitEarly);
  }
}
