import { Prisma } from '@prisma/client'
import { returnCategoryObject } from '../category/return-category.object'

export const returnProductObject: Prisma.ProductSelect = {
	id: true,
	name: true,
	slug: true,
	price: true,
	image: true,
	description: true,
	specifications: {
		select: {
			id: true,
			name: true,
			value: true
		}
	},
	category: {
		select: returnCategoryObject
	},
	productItems: {
		select: {
			id: true,
			name: true,
			quantity: true,
			price: true
		}
	}
}
