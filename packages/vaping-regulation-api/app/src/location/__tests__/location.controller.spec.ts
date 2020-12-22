import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { LocationService } from 'src/location/location.service';
import { LocationController } from 'src/location/location.controller';
import { LocationEntity } from 'src/location/entities/location.entity';
import { AuthGuard, RoleGuard } from 'src/auth/auth.module';
import { BusinessEntity } from 'src/business/entities/business.entity';

import { MockRepository } from 'src/utils/mock-repository';
class MockedLocationRepository extends MockRepository<LocationEntity> {}
class MockedBusinessRepository extends MockRepository<BusinessEntity> {}

describe('Location Controller', () => {
  let controller: LocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        LocationService,
        {
          provide: getRepositoryToken(LocationEntity),
          useClass: MockedLocationRepository,
        },
        {
          provide: getRepositoryToken(BusinessEntity),
          useClass: MockedBusinessRepository,
        }
      ]
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<LocationController>(LocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
