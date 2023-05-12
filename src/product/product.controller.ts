import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { ProductDto, UpdateProductDto } from './product.dto'
import { ProductService } from './product.service'

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Get()
	async getAll() {
		return this.productService.getAll()
	}

	@Get('by-category/:categorySlug')
	async getProductsByCategory(@Param('categorySlug') categorySlug: string) {
		return this.productService.byCategory(categorySlug)
	}

	@Get('by-slug/:slug')
	async getProductsBySlug(@Param('slug') slug: string) {
		return this.productService.bySlug(slug)
	}

	@Auth()
	@Get(':id')
	async getProductsById(@Param('id') id: string) {
		return this.productService.byId(Number(id))
	}

	@Auth()
	@Post()
	async create(@Body() dto: ProductDto) {
		return this.productService.create(dto)
	}

	@Auth()
	@Put(':id')
	async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
		return this.productService.update(Number(id), dto)
	}

	@Auth()
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.productService.delete(Number(id))
	}
}
