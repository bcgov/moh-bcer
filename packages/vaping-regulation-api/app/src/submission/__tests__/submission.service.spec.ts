import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BusinessService } from 'src/business/business.service';
import { LocationService } from 'src/location/location.service';
import { MockRepository } from 'src/utils/mock-repository';
import { SubmissionDTO } from 'src/submission/dto/submission.dto';
import { SubmissionEntity } from 'src/submission/entities/submission.entity';
import { SubmissionService } from 'src/submission/submission.service';
import { SubmissionTypeEnum } from 'src/submission/enums/submission.enum';

const submission = {
  id: 'abcde',
  type: SubmissionTypeEnum.noi,
  data: '{}',
}

const submissionDTO: SubmissionDTO = {
  legalName: '1111',
  type: SubmissionTypeEnum.noi,
  data: {},
};

class MockedSubmissionRepository extends MockRepository<SubmissionEntity> {
  findOne = jest.fn().mockResolvedValue(submission);
}

class MockBusinessService {
  getBusiness = jest.fn().mockResolvedValue(null);
  createBusiness = jest.fn().mockImplementation();
}

class MockLocationService {
  createLocations = jest.fn().mockImplementation();
}

describe('SubmissionService', () => {
  let service: SubmissionService;
  let repository: Repository<SubmissionEntity>;
  let mockBusinessService: BusinessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubmissionService,
        {
          provide: getRepositoryToken(SubmissionEntity),
          useClass: MockedSubmissionRepository,
        },
        {
          provide: BusinessService,
          useClass: MockBusinessService
        },
        {
          provide: LocationService,
          useClass: MockLocationService
        },
      ],
    }).compile();

    service = module.get<SubmissionService>(SubmissionService);
    repository = module.get(getRepositoryToken(SubmissionEntity));
    mockBusinessService = module.get<BusinessService>(BusinessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find submissions with a bceid', async () => {
    const submission = await service.getOne('1234');
    expect(submission).toBeDefined();
    expect(submission.type).toEqual(SubmissionTypeEnum.noi);
  });

  it('should call the save, and the businessService/locationService', async () => {
    // Possibly temporary if we can just do a : SubmissionEntity = {} someday
    const savedSubmission = new SubmissionEntity();
    savedSubmission.id = 'abcde';
    savedSubmission.data = '{}';
    savedSubmission.type = SubmissionTypeEnum.noi;

    const createSpy = jest.spyOn(repository, 'create').mockImplementationOnce(() => savedSubmission);
    const saveSpy = jest.spyOn(repository, 'save').mockResolvedValue(savedSubmission);
    const result = await service.createSubmission(submissionDTO);
    expect(createSpy).toBeCalledWith(submissionDTO);
    expect(saveSpy).toBeCalledWith(savedSubmission);
    expect(result).toEqual(savedSubmission);
  });

  it('should call create a business if it doesn\'t exist', async () => {
    const savedSubmission = new SubmissionEntity();
    savedSubmission.id = 'abcde';
    savedSubmission.data = '{}';
    savedSubmission.type = SubmissionTypeEnum.noi;

    jest.spyOn(repository, 'create').mockImplementationOnce(() => savedSubmission);
    jest.spyOn(repository, 'save').mockResolvedValue(savedSubmission);
    const createBusinessSpy = jest.spyOn(mockBusinessService, 'createBusiness').mockImplementation();
    await service.createSubmission(submissionDTO);
    expect(createBusinessSpy).toBeCalledWith({ legalName: submissionDTO.legalName });
  });
});
