import { Injectable } from '@nestjs/common'

@Injectable()
export class ProductService {
	getAll() {
		return {
			name: 'ЛРСП-20'
		}
	}
}
