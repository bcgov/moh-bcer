import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductEntity } from 'src/products/entities/product.entity';
import { LocationEntity } from 'src/location/entities/location.entity';
import { LocationModule } from 'src/location/location.module';
import { BusinessEntity } from 'src/business/entities/business.entity';
import { UserMiddleware } from 'src/user/middleware/user.middleware';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LocationEntity, BusinessEntity, ProductEntity]),
    forwardRef(() => LocationModule),
    forwardRef(() => UserModule),
  ],
  exports: [ProductsService],
  providers: [ProductsService],
  controllers: [ProductsController]
})
export class ProductsModule {
  async configure(consumer: MiddlewareConsumer) {
    await consumer
      .apply(UserMiddleware)
      .forRoutes(ProductsController);
  }
}
