import type { LogoutInput } from "@/application/dtos/refresh-token.dto.js";
import type { TokenHasher } from "@/application/ports/token-hasher.js";
import type { RefreshTokenRepository } from "@/domain/repositories/refresh-token.repository.js";

export class LogoutUseCase {
    constructor(
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly tokenHasher: TokenHasher
    ){}

    async execute(input: LogoutInput){
        const tokenHash = this.tokenHasher.hash(input.refreshToken);

        const storedToken = await this.refreshTokenRepository.findByTokenHash(tokenHash);

        if(storedToken && !storedToken.isRevoked){
            storedToken.revoke();
            await this.refreshTokenRepository.save(storedToken);
        }

        return undefined;
    }
}