import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportDataPortalController } from './reportDataPortal.controller';
import { ReportEntity } from './entities/report.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReportEntity]),
    UserModule
  ],
  controllers: [ReportDataPortalController],
  providers: [ReportService],
  exports: [ReportService],
})

export class ReportModule {}
