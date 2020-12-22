import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from 'src/location/location.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LocationEntity } from 'src/location/entities/location.entity';
import { BusinessEntity } from 'src/business/entities/business.entity';

import { MockRepository } from 'src/utils/mock-repository';
class MockedLocationRepository extends MockRepository<LocationEntity> {}
class MockedBusinessRepository extends MockRepository<BusinessEntity> {}

describe('LocationService', () => {
  let service: LocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
