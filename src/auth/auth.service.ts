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
import { RefreshTokenDto } from './dto/refreshToken.dto'

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, private jwt: JwtService) {}

	async register(dto: AuthDto) {
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

		const tokens = await this.issueTokens(newUser.id)

		return {
			user: this.returnUserFields(newUser),
			...tokens
		}
	}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)

		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	async getNewTokens({ refreshToken }: RefreshTokenDto) {
		try {
			const result = await this.jwt.verifyAsync(refreshToken)

			if (!result) throw new UnauthorizedException('Ошибка токена')

			const user = await this.prisma.user.findUnique({
				where: {
					id: result.id
				}
			})

			const tokens = await this.issueTokens(user.id)

			return {
				user: this.returnUserFields(user),
				...tokens
			}
		} catch (error) {
			throw new UnauthorizedException(() => error)
		}
	}

	private async issueTokens(userId: number) {
		const data = { id: userId }

		const accessToken = await this.jwt.signAsync(data, {
			expiresIn: '5m' // 5m
		})

		const refreshToken = await this.jwt.signAsync(data, {
			expiresIn: '30m' // 30m
		})

		return { accessToken, refreshToken }
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

	private returnUserFields(user: User) {
		return {
			id: user.id,
			login: user.login
		}
	}
}
