import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { LocationService } from 'src/location/location.service';

(async () => {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const locationService = await appContext.get(LocationService);
  try {
    const result = await locationService.updateGeoCodeForExistingLocations();
    Logger.log('Successfully geocoded existing addresses');
    Logger.log(result);
  } catch (err) {
    Logger.error(err);
  }
})();
