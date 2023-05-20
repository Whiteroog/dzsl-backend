import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductDto, UpdateProductDto } from './product.dto'
import { returnProductObject } from './return-product.object'

@Injectable()
export class ProductService {
	logger: Logger

	constructor(private prisma: PrismaService) {
		this.logger = new Logger()
	}

	async getAll() {
		return await this.prisma.product.findMany({
			select: returnProductObject,
			orderBy: { id: 'desc' }
		})
	}

	async byCategory(categorySlug: string) {
		const products = await this.prisma.product.findMany({
			where: {
				category: {
					slug: categorySlug
				}
			},
			select: returnProductObject,
			orderBy: { id: 'desc' }
		})
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

	async create(dto: ProductDto) {
		const product = await this.prisma.product.create({
			data: {
				name: dto.name,
				slug: dto.slug,
				price: Number(dto.price),
				image: dto.image,
				description: dto.description,
				category: {
					connect: {
						id: dto.category.id
					}
				}
			}
		})

		if (dto.specifications) {
			await this.prisma.specifications.createMany({
				data: dto.specifications.map(item => ({
					name: item.name,
					value: item.value,
					productId: product.id
				}))
			})
		}

		if (dto.productItems) {
			await this.prisma.productItem.createMany({
				data: dto.productItems.map(item => ({
					name: item.name,
					quantity: item.quantity,
					price: item.price,
					productId: product.id
				}))
			})
		}

		return product
	}

	async update(id: number, dto: UpdateProductDto) {
		const product = await this.prisma.product.update({
			where: { id },
			data: {
				name: dto.product.name,
				slug: dto.product.slug,
				price: Number(dto.product.price),
				image: dto.product.image,
				description: dto.product.description,
				category: {
					connect: {
						id: dto.product.category.id
					}
				}
			}
		})

		if (dto.specifications.createSpecifications) {
			await this.prisma.specifications.createMany({
				data: dto.specifications.createSpecifications.map(item => ({
					name: item.name,
					value: item.value,
					productId: id
				}))
			})
		}
		if (dto.specifications.updateSpecifications) {
			dto.specifications.updateSpecifications.forEach(async item => {
				await this.prisma.specifications.update({
					where: { id: item.id },
					data: {
						name: item.name,
						value: item.value
					}
				})
			})
		}
		if (dto.specifications.deleteSpecifications) {
			await this.prisma.specifications.deleteMany({
				where: {
					id: {
						in: dto.specifications.deleteSpecifications.map(item => item.id)
					}
				}
			})
		}

		if (dto.productItems.createProductItems) {
			await this.prisma.productItem.createMany({
				data: dto.productItems.createProductItems.map(item => ({
					name: item.name,
					quantity: item.quantity,
					price: item.price,
					productId: id
				}))
			})
		}
		if (dto.productItems.updateProductItems) {
			dto.productItems.updateProductItems.forEach(async item => {
				await this.prisma.productItem.update({
					where: { id: item.id },
					data: {
						name: item.name,
						quantity: item.quantity,
						price: item.price
					}
				})
			})
		}
		if (dto.productItems.deleteProductItems) {
			await this.prisma.productItem.deleteMany({
				where: {
					id: {
						in: dto.productItems.deleteProductItems.map(item => item.id)
					}
				}
			})
		}

		return product
	}

	async delete(id: number) {
		await this.prisma.productItem.deleteMany({
			where: {
				productId: id
			}
		})

		await this.prisma.specifications.deleteMany({
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
}
