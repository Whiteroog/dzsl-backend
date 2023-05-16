export class ProductDto {
	name: string
	slug: string
	price: number
	image: string
	description: string
	category: ICategory
	specifications?: ISpecifications[]
	productItems?: IProductItem[]
}

interface ISpecifications {
	id?: number
	name: string
	value: number
}

interface IProductItem {
	id?: number
	name: string
	quantity: number
	price: number
}

interface ICategory {
	id: number
	name: string
	slug: string
}

export class UpdateProductDto {
	product: ProductDto

	createSpecifications?: ISpecifications[]
	updateSpecifications?: ISpecifications[]
	deleteSpecifications?: ISpecifications[]

	createProductItems?: IProductItem[]
	updateProductItems?: IProductItem[]
	deleteProductItems?: IProductItem[]
}
