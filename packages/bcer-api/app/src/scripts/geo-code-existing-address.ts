import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { LocationService } from "src/location/location.service";


(async () => {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const locationService = await appContext.get(LocationService);
  const result = await locationService.updateGeoCodeForExistingLocations();
  console.log(result);
})();
