import type { RefreshSessionInput, RefreshSessionOutput } from "@/application/dtos/refresh-token.dto.js";
import type { TokenHasher } from "@/application/ports/token-hasher.js";
import type { GenerateTokenPairService } from "@/application/services/generate-token-pair.service.js";
import { InvalidRefreshTokenError } from "@/domain/errors/invalid-refresh-token.error.js";
import type { RefreshTokenRepository } from "@/domain/repositories/refresh-token.repository.js";

export class RefreshSession {
    constructor(
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly tokenHasher: TokenHasher,
        private readonly generateTokenPair: GenerateTokenPairService
    ){}

    async execute(input: RefreshSessionInput): Promise<RefreshSessionOutput> {
        const tokenHash = this.tokenHasher.hash(input.refreshToken);

        const storedToken = await this.refreshTokenRepository.findByTokenHash(tokenHash);

        if(!storedToken){
            throw new InvalidRefreshTokenError();
        }

        if(storedToken.isRevoked){
            await this.refreshTokenRepository.revokeAllByUserId(storedToken.userId.value);
            throw new InvalidRefreshTokenError();
        }

        if(storedToken.isExpired){
            throw new InvalidRefreshTokenError();
        }

        storedToken.revoke();
        await this.refreshTokenRepository.save(storedToken);

        const tokens = await this.generateTokenPair.execute(
            storedToken.userId.value,
            storedToken.role
        );

        return tokens;
    }
}