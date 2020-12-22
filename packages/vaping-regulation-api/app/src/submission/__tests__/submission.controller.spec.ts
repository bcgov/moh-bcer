import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { AuthGuard, RoleGuard } from 'src/auth/auth.module';
import { BusinessEntity } from 'src/business/entities/business.entity';
import { BusinessService } from 'src/business/business.service';
import { LocationEntity } from 'src/location/entities/location.entity';
import { LocationService } from 'src/location/location.service';
import { NoiEntity } from 'src/business/entities/noi.entity';
import { SubmissionController } from 'src/submission/submission.controller';
import { SubmissionEntity } from 'src/submission/entities/submission.entity';
import { SubmissionService } from 'src/submission/submission.service';
import { getRepositoryToken } from '@nestjs/typeorm';

class BusinessEntityRepository extends Repository<BusinessEntity> {}
class LocationEntityRepository extends Repository<LocationEntity> {}
class NoiEntityRepository extends Repository<NoiEntity> {}
class SubmissionEntityRepository extends Repository<SubmissionEntity> {
  delete = jest.fn().mockImplementation();
}

describe('SubmissionController', () => {
  let controller: SubmissionController;
  let service: SubmissionService;
  let submissionRepository: SubmissionEntityRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubmissionController],
      providers: [
        BusinessService,
        LocationService,
        SubmissionService,
        {
          provide: 'BusinessEntityRepository',
          useClass: BusinessEntityRepository
        },
        {
          provide: 'LocationEntityRepository',
          useClass: LocationEntityRepository
        },
        {
          provide: 'NoiEntityRepository',
          useClass: NoiEntityRepository
        },
        {
          provide: 'SubmissionEntityRepository',
          useClass: SubmissionEntityRepository
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: () => true })
      .compile();

    service = module.get<SubmissionService>(SubmissionService);
    controller = module.get<SubmissionController>(SubmissionController);
    submissionRepository = module.get(getRepositoryToken(SubmissionEntity));
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });

  it('should successfully call repository functions', async () => {
    const deleteSpy = jest.spyOn(submissionRepository, 'delete').mockImplementation();
    await controller.clearSubmissions();
    expect(deleteSpy).toHaveBeenCalled();
  });
});