import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CategoryDto } from './category.dto'
import { returnCategoryObject } from './return-category.object'

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		return await this.prisma.category.findMany({
			select: returnCategoryObject,
			orderBy: { id: 'desc' }
		})
	}

	async bySlug(slug: string) {
		const category = await this.prisma.category.findUnique({
			where: {
				slug
			},
			select: returnCategoryObject
		})

		if (!category) {
			throw new NotFoundException('Категория не найдена')
		}

		return category
	}

	async byId(id: number) {
		const category = await this.prisma.category.findUnique({
			where: {
				id
			},
			select: returnCategoryObject
		})

		if (!category) {
			throw new NotFoundException('Категория не найдена')
		}

		return category
	}

	async create(dto: CategoryDto) {
		return await this.prisma.category.create({
			data: dto
		})
	}

	async update(id: number, dto: CategoryDto) {
		return await this.prisma.category.update({
			where: {
				id
			},
			data: dto
		})
	}

	async delete(id: number) {
		return await this.prisma.category.delete({
			where: {
				id
			}
		})
	}
}
