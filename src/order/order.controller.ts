import { Body, Controller, Get, Param, Patch } from '@nestjs/common'
import { EnumOrderStatus } from '@prisma/client'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { OrderService } from './order.service'

@Controller('order')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Auth()
	@Get()
	async getAll() {
		return this.orderService.getAll()
	}

	@Auth()
	@Get(':id')
	async getOrdersById(@Param('id') id: string) {
		return this.orderService.byId(Number(id))
	}

	@Auth()
	@Patch(':id')
	async updateOrderStatus(
		@Param('id') id: string,
		@Body() { status }: { status: EnumOrderStatus }
	) {
		return this.orderService.updateStatus(Number(id), status)
	}
}
