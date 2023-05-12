export class OrderDto {
	fullName: string
	email: string
	phone: string
	totalPrice: number
	orderProduct: IOrderProduct
}

interface IOrderProduct {
	name: string
	category: string
	quantity: number
	price: number
	orderProductItems: IOrderProductItem[]
}

interface IOrderProductItem {
	name: string
	quantity: number
	price: number
}
