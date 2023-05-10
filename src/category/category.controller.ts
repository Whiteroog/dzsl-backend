import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CategoryDto } from './category.dto'
import { CategoryService } from './category.service'

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get()
	async getAll() {
		return this.categoryService.getAll()
	}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.categoryService.bySlug(slug)
	}

	@Auth()
	@Get(':id')
	async getById(@Param('id') id: string) {
		return this.categoryService.byId(Number(id))
	}

	@Auth()
	@Post()
	async create() {
		return this.categoryService.create()
	}

	@Auth()
	@Put(':id')
	async update(@Param('id') id: string, @Body() dto: CategoryDto) {
		return this.categoryService.update(Number(id), dto)
	}

	@Auth()
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.categoryService.delete(Number(id))
	}
}
