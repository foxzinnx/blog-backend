import type { UpdateUserInputDTO } from "@/application/dtos/user.dto.js";
import { EmailAlreadyInUseError } from "@/domain/errors/email-already-in-use.error.js";
import { NotFoundError } from "@/domain/errors/not-found.error.js";
import { SlugAlreayInUseError } from "@/domain/errors/slug-alreay-in-use.error.js";
import type { UserRepository } from "@/domain/repositories/user.repository.js";

export class UpdateUserUseCase {
    constructor(
        private readonly userRepository: UserRepository
    ){}

    async execute(id: string, input: UpdateUserInputDTO){
        const user = await this.userRepository.findById(id);
        if(!user){
            throw new NotFoundError('Usuário');
        }

        if(input.email && input.email !== user.email.value){
            const existingByEmail = await this.userRepository.findByEmail(input.email);
            if(existingByEmail){
                throw new EmailAlreadyInUseError();
            }
            user.updateEmail(input.email);
        }

        if(input.name){
            user.updateName(input.name);
        }

        if(input.slug && input.slug !== user.slug.value){
            const existingBySlug = await this.userRepository.findBySlug(input.slug);
            if(existingBySlug){
                throw new SlugAlreayInUseError();
            }
            user.updateSlug(input.slug);
        }

        if(input.bio){
            user.updateBio(input.bio);
        }

        await this.userRepository.save(user);

        return user.toOutputDTO();
    }
}