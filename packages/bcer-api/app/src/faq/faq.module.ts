import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { FaqEntity } from './entities/faq.entity';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import { FaqDataPortalController } from './faqDataPortal.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([FaqEntity]),
    UserModule,
  ],
  providers: [FaqService],
  controllers: [FaqController, FaqDataPortalController],
  exports: [FaqService],
})
export class FaqModule {}
