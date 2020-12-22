import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { SubmissionModule } from 'src/submission/submission.module';
import { BusinessModule } from 'src/business/business.module';

@Module({
  imports: [
    SubmissionModule,
    BusinessModule,
  ],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}
