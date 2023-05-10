import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { UserDto } from './user.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Auth()
	@Get()
	async getAll() {
		return this.userService.getAll()
	}

	@Auth()
	@Post()
	async create(@Body() dto: UserDto) {
		return this.userService.create(dto)
	}

	@Auth()
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.userService.delete(Number(id))
	}

	@Auth()
	@Patch(':id')
	async setNewPassword(
		@Param('id') id: string,
		@Body() { newPassword }: { newPassword: string }
	) {
		return this.userService.setNewPassword(Number(id), newPassword)
	}
}
