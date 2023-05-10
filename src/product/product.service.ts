import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductDto, ProductItemDto, SpecificationsDto } from './product.dto'
import { returnProductObject } from './return-product.object'

@Injectable()
export class ProductService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		return this.prisma.product.findMany({
			select: returnProductObject
		})
	}

	async byCategory(categorySlug: string) {
		const products = await this.prisma.product.findMany({
			where: {
				category: {
					slug: categorySlug
				}
			},
			select: returnProductObject
		})

		if (!products) throw new NotFoundException('Товар не найден')
		return products
	}

	async bySlug(slug: string) {
		const product = await this.prisma.product.findUnique({
			where: {
				slug
			},
			select: returnProductObject
		})

		if (!product) throw new NotFoundException('Товар не найден')
		return product
	}

	async byId(id: number) {
		const product = await this.prisma.product.findUnique({
			where: {
				id
			},
			select: returnProductObject
		})

		if (!product) throw new NotFoundException('Товар не найден')
		return product
	}

	async createProduct() {
		return await this.prisma.product.create({
			data: {
				name: '',
				slug: '',
				price: 0,
				image: 'no-image.png',
				description: ''
			}
		})
	}

	async updateProduct(id: number, dto: ProductDto) {
		const { name, slug, price, image, description, categoryId } = dto

		return await this.prisma.product.update({
			where: { id },
			data: {
				name,
				slug,
				price,
				image,
				description,
				categoryId
			}
		})
	}

	async deleteProduct(id: number) {
		await this.prisma.specifications.deleteMany({
			where: {
				productId: id
			}
		})

		await this.prisma.productItem.deleteMany({
			where: {
				productId: id
			}
		})

		return await this.prisma.product.delete({
			where: {
				id
			}
		})
	}

	async createSpecifications(productId: number) {
		return await this.prisma.specifications.create({
			data: {
				name: '',
				value: 0,
				productId
			}
		})
	}

	async updateSpecifications(id: number, dto: SpecificationsDto) {
		return await this.prisma.specifications.update({
			where: { id },
			data: {
				name: dto.name,
				value: dto.value
			}
		})
	}

	async deleteSpecifications(id: number) {
		return await this.prisma.specifications.delete({
			where: { id }
		})
	}

	async createProductItem(productId: number) {
		return await this.prisma.productItem.create({
			data: {
				name: '',
				quantity: 1,
				price: 0,
				productId
			}
		})
	}

	async updateProductItem(id: number, dto: ProductItemDto) {
		return await this.prisma.productItem.update({
			where: { id },
			data: {
				name: dto.name,
				quantity: dto.quantity,
				price: dto.price
			}
		})
	}

	async deleteProductItem(id: number) {
		return await this.prisma.productItem.delete({
			where: { id }
		})
	}
}
