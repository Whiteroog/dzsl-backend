export class ProductDto {
	name: string
	slug: string
	price: number
	image: string
	description: string
	categoryId: number
}

export class SpecificationsDto {
	name: string
	value: number
}

export class ProductItemDto {
	name: string
	quantity: number
	price: number
}
