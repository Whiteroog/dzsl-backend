import { IsString } from 'class-validator'

export class RefreshTokenDto {
	@IsString({
		message: 'Нет токена, либо это не является токеном'
	})
	refreshToken: string
}
