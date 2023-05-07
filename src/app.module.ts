import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma.service'
import { ProductModule } from './product/product.module'
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';

@Module({
	imports: [ConfigModule.forRoot(), ProductModule, AuthModule, UserModule, OrderModule, CategoryModule],
	providers: [PrismaService]
})
export class AppModule {}
