import { NotFoundError } from "@/domain/errors/not-found.error.js";
import { UnauthorizedError } from "@/domain/errors/unauthorized.error.js";
import type { UserRepository } from "@/domain/repositories/user.repository.js";
import { UniqueEntityId } from "@/domain/value-objects/unique-entity-id.vo.js";

export class DeleteUserUseCase {
    constructor(private readonly userRepository: UserRepository){}

    async execute(id: string): Promise<void> {
        const user = await this.userRepository.findById(id);
        if(!user){
            throw new NotFoundError('Usuário');
        }

        const userId = new UniqueEntityId(id);
        if(!userId.equals(user.id)){
            throw new UnauthorizedError();
        }

        await this.userRepository.delete(id);
    }
}