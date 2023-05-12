export class OrderDto {
	fullName: string
	email: string
	phone: string
	totalPrice: number
	orderProduct: OrderProductDto
}

export class OrderProductDto {
	name: string
	category: string
	quantity: number
	price: number
	orderProductItems: OrderProductItemDto[]
}

export class OrderProductItemDto {
	name: string
	quantity: number
	price: number
}
