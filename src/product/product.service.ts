import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductDto, UpdateProductDto } from './product.dto'
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
		return await this.prisma.product.create({
			data: {
				name: dto.name,
				slug: dto.slug,
				price: dto.price,
				image: dto.image,
				description: dto.description,
				category: {
					connectOrCreate: {
						where: {
							id: dto.category.id
						},
						create: dto.category
					}
				},
				specifications: {
					createMany: {
						data: dto.specifications
					}
				},
				productItems: {
					createMany: {
						data: dto.productItems
					}
				}
			}
		})
	}

	async update(id: number, dto: UpdateProductDto) {
		dto.updateSpecifications.forEach(item => {
			this.prisma.specifications.update({
				where: { id: item.id },
				data: {
					name: item.name,
					value: item.value
				}
			})
		})

		dto.updateProductItems.forEach(item => {
			this.prisma.productItem.update({
				where: { id: item.id },
				data: {
					name: item.name,
					quantity: item.quantity,
					price: item.price
				}
			})
		})

		return await this.prisma.product.update({
			where: { id },
			data: {
				name: dto.product.name,
				slug: dto.product.slug,
				price: dto.product.price,
				image: dto.product.image,
				description: dto.product.description,
				category: {
					connectOrCreate: {
						where: {
							id: dto.product.category.id
						},
						create: dto.product.category
					}
				},
				specifications: {
					deleteMany: {
						id: {
							in: dto.deleteSpecifications.map(item => item.id)
						}
					},
					createMany: {
						data: dto.createSpecifications
					}
				},
				productItems: {
					deleteMany: {
						id: {
							in: dto.deleteProductItems.map(item => item.id)
						}
					},
					createMany: {
						data: dto.createProductItems
					}
				}
			}
		})
	}

	async delete(id: number) {
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
}
