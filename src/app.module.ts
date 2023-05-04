import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma.service'
import { ProductModule } from './product/product.module'
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [ConfigModule.forRoot(), ProductModule, AuthModule],
	providers: [PrismaService]
})
export class AppModule {}
