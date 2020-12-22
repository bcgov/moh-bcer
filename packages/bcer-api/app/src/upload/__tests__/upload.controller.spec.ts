import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard, RoleGuard } from 'src/auth/auth.module';
import { UploadService } from 'src/upload/upload.service';
import { BusinessService } from 'src/business/business.service';
import { UploadController } from 'src/upload/upload.controller';
import { SubmissionService } from 'src/submission/submission.service';

class MockUploadService {}
class MockSubmissionService {
  public createSubmission(): void {};
  public async getSubmissions(): Promise<void> { return; };
  public async saveSubmission(): Promise<void> { return; };
}
class MockBusinessService {
  public createBusiness(): void {};
  public async getBusinesses(): Promise<void> { return; };
  public async clearBusinesses(): Promise<void> { return; };
  public async getBusiness(): Promise<void> { return; };
}

describe('Upload Controller', () => {
  let controller: UploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: UploadService,
          useClass: MockUploadService
        },
        {
          provide: SubmissionService,
          useClass: MockSubmissionService
        },
        {
          provide: BusinessService,
          useClass: MockBusinessService
        }
      ]
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UploadController>(UploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
