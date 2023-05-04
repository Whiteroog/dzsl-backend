import { IsString, MinLength } from 'class-validator'

export class AuthDto {
	@IsString()
	@MinLength(3, {
		message: 'Логин должен быть больше 3 символов'
	})
	login: string

	@IsString()
	@MinLength(3, {
		message: 'Пароль должен быть больше 3 символов'
	})
	password: string
}
