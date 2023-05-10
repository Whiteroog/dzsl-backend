import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { ProductDto, ProductItemDto, SpecificationsDto } from './product.dto'
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
	async createProduct() {
		return this.productService.createProduct()
	}

	@Auth()
	@Put(':id')
	async updateProduct(@Param('id') id: string, @Body() dto: ProductDto) {
		return this.productService.updateProduct(Number(id), dto)
	}

	@Auth()
	@Delete(':id')
	async deleteProduct(@Param('id') id: string) {
		return this.productService.deleteProduct(Number(id))
	}

	@Auth()
	@Post('specifications/:productId')
	async createSpecifications(@Param('productId') productId: string) {
		return this.productService.createSpecifications(Number(productId))
	}

	@Auth()
	@Put('specifications/:id')
	async updateSpecifications(
		@Param('id') id: string,
		@Body() dto: SpecificationsDto
	) {
		return this.productService.updateSpecifications(Number(id), dto)
	}

	@Auth()
	@Delete('specifications/:id')
	async deleteSpecifications(@Param('id') id: string) {
		return this.productService.deleteSpecifications(Number(id))
	}

	@Auth()
	@Post('product-item/:productId')
	async createProductItem(@Param('productId') productId: string) {
		return this.productService.createProductItem(Number(productId))
	}

	@Auth()
	@Put('product-item/:id')
	async updateProductItem(
		@Param('id') id: string,
		@Body() dto: ProductItemDto
	) {
		return this.productService.updateProductItem(Number(id), dto)
	}

	@Auth()
	@Delete('product-item/:id')
	async deleteProductItem(@Param('id') id: string) {
		return this.productService.deleteProductItem(Number(id))
	}
}
