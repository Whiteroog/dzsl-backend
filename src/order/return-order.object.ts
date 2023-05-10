import { Prisma } from '@prisma/client'

export const returnOrderObject: Prisma.OrderSelect = {
	id: true,
	createdAt: true,
	fullName: true,
	email: true,
	phone: true,
	totalPrice: true,
	status: true,
	orderProducts: {
		select: {
			id: true,
			name: true,
			category: true,
			quantity: true,
			price: true,
			orderProductItems: {
				select: {
					id: true,
					name: true,
					quantity: true,
					price: true
				}
			}
		}
	}
}
