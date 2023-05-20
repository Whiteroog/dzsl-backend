import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module'
import { OrderModule } from './order/order.module'
import { PrismaService } from './prisma.service'
import { ProductModule } from './product/product.module'
import { UserModule } from './user/user.module'
import { FileModule } from './file/file.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		ProductModule,
		AuthModule,
		UserModule,
		OrderModule,
		CategoryModule,
		FileModule
	],
	providers: [PrismaService]
})
export class AppModule {}
