import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { EnumOrderStatus } from '@prisma/client'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { OrderDto } from './order.dto'
import { OrderService } from './order.service'

@Controller('orders')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Post()
	async create(@Body() dto: OrderDto) {
		return this.orderService.create(dto)
	}

	@Auth()
	@Get()
	async getAll() {
		return this.orderService.getAll()
	}

	@Auth()
	@Get(':id')
	async getById(@Param('id') id: string) {
		return this.orderService.byId(Number(id))
	}

	@Auth()
	@Patch(':id')
	async updateStatus(
		@Param('id') id: string,
		@Body() { status }: { status: EnumOrderStatus }
	) {
		return this.orderService.updateStatus(Number(id), status)
	}
}
