import { Injectable, NotFoundException } from '@nestjs/common'
import { EnumOrderStatus } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { OrderDto, OrderProductDto, OrderProductItemDto } from './order.dto'
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

	async createOrder(dto: OrderDto) {
		return this.prisma.order.create({
			data: {
				fullName: dto.fullName,
				email: dto.email,
				phone: dto.phone,
				status: EnumOrderStatus.NEW,
				totalPrice: dto.totalPrice
			}
		})
	}

	async updateStatus(id: number, status: EnumOrderStatus) {
		return this.prisma.order.update({
			where: { id },
			data: {
				status
			}
		})
	}

	async createOrderProduct(orderId: number, dto: OrderProductDto) {
		return this.prisma.orderProduct.create({
			data: {
				name: dto.name,
				category: dto.category,
				quantity: dto.quantity,
				price: dto.price,
				orderId
			}
		})
	}

	async createOrderProductItem(
		orderProductId: number,
		dto: OrderProductItemDto
	) {
		return this.prisma.orderProductItem.create({
			data: {
				name: dto.name,
				quantity: dto.quantity,
				price: dto.price,
				orderProductId
			}
		})
	}
}
