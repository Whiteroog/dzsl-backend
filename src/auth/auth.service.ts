import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { hash, verify } from 'argon2'
import { PrismaService } from 'src/prisma.service'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, private jwt: JwtService) {}

	async register(dto: AuthDto) {
		const userExists = await this.prisma.user.findUnique({
			where: {
				login: dto.login
			}
		})

		if (userExists)
			throw new BadRequestException('Пользователь с таким логином существует')

		const newUser = await this.prisma.user.create({
			data: {
				login: dto.login,
				password: await hash(dto.password)
			}
		})

		const tokens = await this.issueTokenPair(newUser.id)

		return {
			user: this.returnUserFields(newUser),
			...tokens
		}
	}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)

		const tokens = await this.issueTokenPair(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	async validateUser(dto: AuthDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				login: dto.login
			}
		})

		if (!user) throw new NotFoundException('Такого Пользователя не существует')

		const isValid = await verify(user.password, dto.password)

		if (!isValid) throw new UnauthorizedException('Неверный пароль')

		return user
	}

	private async issueTokenPair(userId: number) {
		const data = { id: userId }

		const accessToken = await this.jwt.signAsync(data, {
			expiresIn: '1h'
		})

		const refreshToken = await this.jwt.signAsync(data, {
			expiresIn: '7d'
		})

		return { accessToken, refreshToken }
	}

	private returnUserFields(user: User) {
		return {
			id: user.id,
			login: user.login
		}
	}
}