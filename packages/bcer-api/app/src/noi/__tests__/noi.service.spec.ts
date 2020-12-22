import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NoiService } from 'src/noi/noi.service';
import { NoiEntity } from 'src/noi/entities/noi.entity';

import { MockRepository } from 'src/utils/mock-repository';
class MockedNoiRepository extends MockRepository<NoiEntity> {}

describe('NoiService', () => {
  let service: NoiService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoiService,
        {
          provide: getRepositoryToken(NoiEntity),
          useClass: MockedNoiRepository
        }
      ]
    }).compile();
    service = module.get<NoiService>(NoiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
