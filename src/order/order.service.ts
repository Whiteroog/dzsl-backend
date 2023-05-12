import { Injectable, NotFoundException } from '@nestjs/common'
import { EnumOrderStatus } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { OrderDto } from './order.dto'
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

	async create(dto: OrderDto) {
		return this.prisma.order.create({
			data: {
				fullName: dto.fullName,
				email: dto.email,
				phone: dto.phone,
				status: EnumOrderStatus.NEW,
				totalPrice: dto.totalPrice,
				orderProduct: {
					create: {
						name: dto.orderProduct.name,
						category: dto.orderProduct.category,
						quantity: dto.orderProduct.quantity,
						price: dto.orderProduct.price,
						orderProductItems: {
							createMany: {
								data: dto.orderProduct.orderProductItems
							}
						}
					}
				}
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
}
