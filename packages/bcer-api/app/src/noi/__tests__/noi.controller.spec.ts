import { Test, TestingModule } from '@nestjs/testing';
import { NoiController } from 'src/noi/noi.controller';
import { NoiService } from 'src/noi/noi.service';

class MockNoiService {
  public createNoi(): void {};
  public async getNois(): Promise<void> { return; };
}

describe('Noi Controller', () => {
  let controller: NoiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoiController],
      providers: [
        {
          provide: NoiService,
          useClass: MockNoiService
        }
      ]
    }).compile();

    controller = module.get<NoiController>(NoiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
