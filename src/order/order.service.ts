import { Injectable, NotFoundException } from '@nestjs/common'
import { EnumOrderStatus } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { returnOrderObject } from './return-order.object'

@Injectable()
export class OrderService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		return this.prisma.order.findMany({
			select: returnOrderObject
		})
	}

	async byId(id: number) {
		const order = await this.prisma.order.findUnique({
			where: { id },
			select: returnOrderObject
		})

		if (!order) throw new NotFoundException('Заказ не найден')
		return order
	}

	async updateStatus(id: number, status: EnumOrderStatus) {
		return this.prisma.order.update({
			where: { id },
			data: {
				status
			}
		})
	}
}
