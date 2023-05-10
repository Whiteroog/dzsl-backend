import { BadRequestException, Injectable } from '@nestjs/common'
import { hash } from 'argon2'
import { PrismaService } from 'src/prisma.service'
import { returnUserObject } from './return-user.object'
import { UserDto } from './user.dto'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		return this.prisma.user.findMany({
			select: returnUserObject
		})
	}

	async create(dto: UserDto) {
		const existsUser = await this.prisma.user.findUnique({
			where: {
				login: dto.login
			}
		})

		if (existsUser)
			throw new BadRequestException('Пользователь с таким логином существует')

		const newUser = await this.prisma.user.create({
			data: {
				login: dto.login,
				password: await hash(dto.password)
			}
		})

		return newUser
	}

	async delete(id: number) {
		return this.prisma.user.delete({
			where: {
				id
			}
		})
	}

	async setNewPassword(id: number, newPassword: string) {
		const updatedUser = await this.prisma.user.update({
			where: {
				id
			},
			data: {
				password: await hash(newPassword)
			}
		})

		return updatedUser
	}
}
