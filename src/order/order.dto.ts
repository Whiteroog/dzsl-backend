export class OrderDto {
	fullName: string
	email: string
	phone: string

	totalPrice: number
}

export class OrderProductDto {
	name: string
	category: string
	quantity: number
	price: number
}

export class OrderProductItemDto {
	name: string

	quantity: number
	price: number
}
