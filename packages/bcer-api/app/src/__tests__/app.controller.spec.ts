import * as httpMocks from 'node-mocks-http';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { AuthGuard, RoleGuard } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

class MockAuthService {
  public async getProfile(authToken: string): Promise<any> { return { firstName: "Test", lastName: "User" }; };
}

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: AuthService,
          useClass: MockAuthService
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: () => true })
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      expect(await appController.getHello()).toBe('Hello World!');
    });

    it('should bleh', async () => {
      const mockRequest = httpMocks.createRequest({ headers: { authorization: null } });
      const profile = await appController.getProfile(mockRequest);
      expect(profile.firstName).toEqual('Test');
    });
  });
});
