import type { AuthenticateUserInputDTO } from "@/application/dtos/user.dto.js";
import type { Hasher } from "@/application/ports/hasher.js";
import { InvalidCredentialsError } from "@/domain/errors/invalid-credentials.error.js";
import { NotFoundError } from "@/domain/errors/not-found.error.js";
import type { UserRepository } from "@/domain/repositories/user.repository.js";

export class AuthenticateUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly hasher: Hasher
    ){}

    async execute(input: AuthenticateUserInputDTO){
        const user = await this.userRepository.findByEmail(input.email);
        if(!user){
            throw new NotFoundError('Usuário');
        }

        const passwordMatch = await this.hasher.compare(input.password, user.passwordHash);

        if(!passwordMatch){
            throw new InvalidCredentialsError();
        }

        return user.toOutputDTO();
    }
}