import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { NoiEntity } from 'src/noi/entities/noi.entity';
import { MockRepository } from 'src/utils/mock-repository';

class MockedNoiRepository extends MockRepository<NoiEntity> {}

describe('BusinessService', () => {
  let service: BusinessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessController],
      providers: [
        BusinessService,
        {
          provide: getRepositoryToken(NoiEntity),
          useClass: MockedNoiRepository,
        },
      ],
    }).compile();

    service = module.get<BusinessService>(BusinessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
