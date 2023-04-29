import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { ProductModule } from './product/product.module'

@Module({
	imports: [ProductModule],
	providers: [PrismaService]
})
export class AppModule {}
