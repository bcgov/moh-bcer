import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManufacturingService } from 'src/manufacturing/manufacturing.service';
import { ManufacturingController } from 'src/manufacturing/manufacturing.controller';
import { ProductEntity } from 'src/products/entities/product.entity'
import { ManufacturingEntity } from 'src/manufacturing/entities/manufacturing.entity'
import { LocationEntity } from 'src/location/entities/location.entity'
import { BusinessEntity } from 'src/business/entities/business.entity';
import { IngredientEntity } from 'src/manufacturing/entities/ingredient.entity'
import { UserMiddleware } from 'src/user/middleware/user.middleware';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IngredientEntity,
      LocationEntity,
      ProductEntity,
      BusinessEntity,
      ManufacturingEntity
    ]),
    forwardRef(() => UserModule),
  ],
  exports: [ManufacturingService],
  providers: [ManufacturingService],
  controllers: [ManufacturingController]
})
export class ManufacturingModule {
  async configure(consumer: MiddlewareConsumer) {
    await consumer
      .apply(UserMiddleware)
      .forRoutes(ManufacturingController);
  }
}
